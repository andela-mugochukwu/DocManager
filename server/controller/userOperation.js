import bcrypt from 'bcrypt-nodejs';
import index from '../models';
import {
  createToken,
  validateEmail,
  validatePassword
} from '../middlewares/validation';

const User = index.User;
const Role = index.Roles;

module.exports = {
  /**
   * Signs up new users to access the application
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {null} Returns void
   */
  signUp(req, res) {
    // find or create the user if they don't already exist in the
    // database
    User.findOrCreate({
      where: {
        username: req.body.userName
      },
      defaults: {
        username: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        roleId: req.body.roleId,
        isactive: req.body.isactive,
      }
    }).spread((createdUser, isCreated) => {
      // send successful as response when the user is created
      if (isCreated) {
        Role.findById(createdUser.roleId).then((userRole) => {
          if (userRole) {
            const userDetail = {
              userName: createdUser.username,
              userId: createdUser.id,
              email: createdUser.email,
              isactive: createdUser.isactive,
              roleType: userRole.roletype,
              createdAt: createdUser.createdAt,
            };
            const token = createToken(userDetail);
            res.status(200).send({
              status: 'successful',
              ...userDetail,
              token,
            });
          }
        }).catch();
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'User already exist',
        });
      }
    }).catch(() => {
      res.status(500).send({
        status: 'unsuccessful',
        message:
        'Server error just occured!'
      });
    });
  },

  /**
   * Authenticates a user
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  signIn(req, res) {
    let errorMessage = '';
    const userException = (message) => {
      errorMessage = message;
      this.name = 'userException';
    };
    const userInfo = req.body;
    User.find({
      where: {
        username: userInfo.userName,
      }
    }).then((existingUser) => {
      const userPassword = existingUser.password;
      if (!existingUser.isactive) {
        throw new userException('user is inactive');
      }
      bcrypt.compare(userInfo.password, userPassword, (err, isValid) => {
        // check if the password is correct then create a token
        if (isValid) {
          Role.findById(existingUser.roleId).then((userRole) => {
            if (userRole) {
              const userDetail = {
                userName: existingUser.username,
                userId: existingUser.id,
                email: existingUser.email,
                isactive: existingUser.isactive,
                roleType: userRole.roletype,
                createdAt: existingUser.createdAt,
              };
              const token = createToken(userDetail);
              res.status(200).send({
                status: 'successful',
                ...userDetail,
                token,
              });
            }
          }).catch();
        } else {
          res.status(400).send({
            status: 'unsuccessful',
            message: ['Wrong password!'],
          });
        }
      });
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: errorMessage !== '' ? errorMessage : ['Wrong username!'],
      });
    });
  },

  /**
   * View specific user profile
  * @param {object} req - The request object from express server
  * @param {object} res - The response object from express server
  * @return {null} Returns null
  */
  viewProfile(req, res) {
    const id = Number(req.params.userId);
    User.findById(id).then((userDetail) => {
      if (userDetail && req.body.user.userId === id
        && userDetail.isactive) {
        res.status(200).send({
          status: 'successful',
          userName: userDetail.username,
          userEmail: userDetail.email,
          userRole: req.body.user.roleType,
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'You cannot view another user\'s detail',
        });
      }
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Error due to invalid user!',
      });
    });
  },

  /**
   * Fetches all users
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  getAll(req, res) {
    // check it limit and offset where passed
    const params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    User.findAndCountAll({
      attributes:
      ['id', 'username', 'email', 'roleId', 'isactive', 'createdAt'],
      ...params
    }).then((users) => {
      res.status(200).send({
        status: 'successful',
        count: users.count,
        users: users.rows,
        curPage: parseInt(params.offset / params.limit, 10) + 1,
        pageCount: parseInt(users.count / params.limit, 10),
        pageSize: users.rows.length
      });
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Could not fetch all users!',
      });
    });
  },

  /**
   * Finds users by username
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  find(req, res) {
    const params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    if (!req.query.q) {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'No username to search for!'
      });
    } else {
      User.findAndCountAll({
        where: {
          username: {
            $iLike: `%${req.query.q}%`
          }
        },
        attributes:
        ['id', 'username', 'email', 'roleId', 'isactive', 'createdAt'],
        ...params,
      }).then((users) => {
        res.status(200).send({
          status: 'successful',
          count: users.count,
          users: users.row,
          curPage: parseInt(params.offset / params.limit, 10) + 1,
          pageCount: parseInt(users.count / params.limit, 10),
          pageSize: users.rows.length
        });
      }).catch(() => {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Unable to get user(s)',
        });
      });
    }
  },

  /**
   * Updates a specific user's role
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  updateRole(req, res) {
    const userId = Number(req.params.id);
    Role.count().then((count) => {
      if (req.body.roleId && req.body.roleId > 0 &&
        req.body.roleId <= count) {
        User.update({ roleId: req.body.roleId }, {
          where: {
            id: userId,
          }
        }).then(() => {
          res.status(200).send({
            status: 'successful',
          });
        }).catch(() => {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Could not find any user to update!',
          });
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Invalid role ID',
        });
      }
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Could not count roles!',
      });
    });
  },

  /**
   * Updates a specific user
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  update(req, res) {
    const userId = Number(req.params.id);
    const userDetail = {};
    if (req.body.email &&
      validateEmail(req.body.email, 'email').status === 'successful') {
      userDetail.email = req.body.email;
    }
    if (typeof req.body.isactive !== 'undefined' &&
      req.body.user.roleType === 'Admin') {
      userDetail.isactive = req.body.isactive;
    }
    if (typeof req.body.isactive !== 'undefined' &&
      req.body.user.roleType === 'SuperAdmin') {
      userDetail.isactive = req.body.isactive;
    }
    if (req.body.password &&
      validatePassword(req.body.password, 'password').status === 'successful') {
      User.findById(req.body.user.userId).then((foundUser) => {
        if (foundUser) {
          bcrypt.compare(req.body.oldPassword, foundUser.password,
            (err, response) => {
              if (response) {
                userDetail.password = req.body.password;
              }
              if (userId === req.body.user.userId
                || req.body.user.roleType === 'SuperAdmin'
                || req.body.user.roleType === 'Admin') {
                User.update(userDetail, {
                  individualHooks: true,
                  where: {
                    id: userId,
                  }
                }).then(() => {
                  if (Object.keys(userDetail).length !== 0) {
                    res.status(200).send({
                      status: 'successful',
                    });
                  } else {
                    res.status(400).send({
                      status: 'unsuccessful',
                      message: 'update failed!',
                    });
                  }
                }).catch(() => {
                  res.status(400).send({
                    status: 'unsuccessful',
                    message: 'Could not find any user to update!',
                  });
                });
              } else {
                res.status(400).send({
                  status: 'unsuccessful',
                  message: 'No user found!',
                });
              }
            });
        } else {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'No user found!',
          });
        }
      });
    } else if (userId === req.body.user.userId
      || req.body.user.roleType === 'SuperAdmin'
      || req.body.user.roleType === 'Admin') {
      Role.count().then((count) => {
        if (req.body.roleId && req.body.roleId > 0 &&
          req.body.roleId <= count &&
          req.body.user.roleType === 'SuperAdmin') {
          userDetail.roleId = req.body.roleId;
        }
        User.update(userDetail, {
          where: {
            id: userId,
          }
        }).then(() => {
          if (Object.keys(userDetail).length !== 0) {
            res.status(200).send({
              status: 'successful',
            });
          } else {
            res.status(400).send({
              status: 'unsuccessful',
              message: 'update failed!',
            });
          }
        }).catch(() => {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Could not find any user to update!',
          });
        });
      }).catch(() => {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Could not count roles!',
        });
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'No user found!',
      });
    }
  },

  /**
   * Delete a specific user
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  delete(req, res) {
    const userId = req.params.id;
    User.findById(userId).then((knownUser) => {
      if (!knownUser) {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Could not find any user!',
        });
      } else {
        let statusUpdate = false;
        if (!knownUser.isactive) {
          statusUpdate = true;
        }
        User.update({ isactive: statusUpdate }, {
          where: {
            id: userId,
          }
        }).then(() => {
          res.status(200).send({
            status: 'successful',
            message: `${knownUser.username} has been successfull
            ${statusUpdate ? 'deactivated!' : 'activated'}`,
          });
        }).catch();
      }
    }).catch(() => {
      res.status(500).send({
        status: 'unsuccessful',
        message: 'Invalid user ID!',
      });
    });
  },
};

