import index from '../models';

const role = index.Roles;
/**
 * Create a role
 * @param {object} req - The request object from the server
 * @param {object} res - The response object from the server
 * @return {null} returns void
 */
const createRole = (req, res) => {
  const roletype = req.body;
  role.findOrCreate({
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
};
export default createRole;
