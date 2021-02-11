const { response, request } = require('express');

const getUser = (req = request, res = response ) => {

    const { q, name = null, apikey, page = 1, limit} = req.query;

    res.json({
        msg: 'get API - controller Users',
        q,
        name,
        apikey,
        page,
        limit
    });
};
const postUser = (req, res = response ) => {

    // TODO: Clean body and securize
    const { name, age } = req.body;
    res.json({
        msg: 'post API - controller Users',
        name,
        age
    });
};
const putUser = (req, res = response ) => {

    const id = req.params.id;

    res.json({
        msg: 'put API - controller Users',
        id
    });
};
const patchUser = (req, res = response ) => {
    res.json({
        msg: 'patch API - controller Users'
    });
};
const deleteUser = (req, res = response ) => {
    res.json({
        msg: 'delete API - controller Users'
    });
};


module.exports = {
    getUser,
    postUser,
    putUser,
    patchUser,
    deleteUser
};