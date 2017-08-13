import index from '../models';

const Role = index.Roles;

module.exports = {
  /**
 * Create a role
 * @param {object} req - The request object from the server
 * @param {object} res - The response object from the server
 * @return {null} returns void
 */
  create(req, res) {
    const roletype = req.body;
    Role.findOrCreate({
      where: { ...roletype },
      defaults: {
        roletype: roletype.roletype,
      }
    }).spread((roleCreated, isCreated) => {
      if (isCreated) {
        res.send({
          status: 'successful'
        });
      } else {
        res.send({
          status: 'unsuccessful',
          message: `${roletype.roletype} Role already exist!`,
        });
      }
    }).catch(() => {
      res.send({
        status: 'unsuccessful',
        message: `Could not create ${roletype.roletype} role!`,
      });
    });
  },

  /**
   * Deletes a given role
   * @param {object} req - The request object from the server
  * @param {object} res - The response object from the server
   * @return {null} returns void
   */
  delete(req, res) {
    const roleId = Number(req.params.id);
    const response = {};
    response.status = 'unsuccessful';
    Role.findById(roleId).then((foundRole) => {
      if (foundRole) {
        foundRole.destroy().then(() => {
          response.status = 'successful';
          response.message = `"${foundRole.roletype}" has been deleted!`;
          return res.status(200).send(response);
        }).catch(() => {
          response.status = 'unsuccessful';
          response.message = 'Could not delete the role!';
          return res.status(400).send(response);
        });
      } else {
        response.status = 'unsuccessful';
        response.message = 'Could not find role!';
        return res.status(400).send(response);
      }
    }).catch(() => {
      response.status = 'unsuccessful';
      response.message = 'Wrong or invalid role ID!';
      return res.status(400).send(response);
    });
  },

  /**
   * Edit user roles
   * @param {object} req - The request object from the server
   * @param {object} res - The response object from the server
   * @return {null} returns void
   */
  edit(req, res) {
    const response = {};
    response.status = 'unsuccessful';
    const newRoleValue = req.body;
    const roleId = Number(req.params.id);
    Role.findById(roleId).then((foundRole) => {
      if (!foundRole) {
        response.message = 'Could not update your role';
        return res.status(400).send(response);
      }
      Role.update({ ...newRoleValue }).then(() => {
        response.status = 'successful';
        return res.status(200).send(response);
      })
        .catch(() => {
          response.message = 'Could not update your role';
          return res.status(400).send(response);
        });
    })
      .catch(() => {
        response.message = 'An error occurred while editing your role';
        return res.status(400).send(response);
      });
  },

  /**
   * Finds a particular role
   * @param {object} req - The request object from the server
   * @param {object} res - The response object from the server
   * @return {null} returns void
   */
  find(req, res) {
    const roleId = Number(req.params.id);
    if (Number.isInteger(roleId) && roleId > 0) {
      Role.findById(roleId).then((foundRole) => {
        if (foundRole) {
          res.status(200).send({
            status: 'successful',
            foundRole,
          });
        } else {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Could not find any role!',
          });
        }
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Invalid search parameter!',
      });
    }
  },

  /**
   * Get all roles
   * @param {object} req - The request object from the server
   * @param {object} res - The response object from the server
   * @return {null} returns void
   */
  getAll(req, res) {
    const response = {};
    response.status = 'unsuccessful';
    // check it limit and offset where passed
    const params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    Role.findAndCountAll({
      attributes: ['id', 'roletype', 'updatedAt'],
      ...params
    }).then((roles) => {
      if (roles.count > 0) {
        response.status = 'successful';
        response.count = roles.count;
        response.roles = roles.rows;
        response.curPage = parseInt(params.offset / params.limit, 10) + 1;
        response.pageCount = parseInt(roles.count / params.limit, 10);
        response.pageSize = roles.rows.length;
        res.status(200).send(response);
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'No role found!',
        });
      }
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'An error occurred!',
      });
    });
  },
};
