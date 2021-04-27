import express from 'express';
import catchAsync from '../helpers/catchAsync';
import recipies from '../../database/schemas/Recipies';

const router = express.Router();

/*
    Retrieves all recipies where the requesting account's id is listed in the 
    recipie's "authoredBy" or "subscribers" property
 */
router.get('/', catchAsync(async (req, res) => {

    return res.status(200).json({ });
}));

/*
    Retrieve a single recipie where the recipie's id matches the search param and 
    the requesting account's id is listed in the recipie's "authoredBy" or "subscribers" property
 */
router.get('/:id', catchAsync(async (req, res) => {

    return res.status(200).json({ });
}));

/*
    Creates a new recipie and set the requesting account's id as the recipie's
    "authoredBy" property
 */
router.post('/', catchAsync(async (req, res) => {

    return res.status(200).json({  });
}));

/*
    Updates an existing recipie where the recipie's id matches the search param and 
    the recipie's "authoredBy" property matches the id of the requesting account

    Recipie properties which can be updated should be restricted to: title, subscribers
 */
router.put('/:id', catchAsync(async (req, res) => {

    return res.status(200).json({  });
}));

/*
    Deletes an existing recipie where the recipie's id matches the search param and 
    the recipie's "authoredBy" property matches the id of the requesting account

    Supporting the ability for other accounts to subscribe to any recipie means a recipie
    should not be able to be completely deleted from DB. This method should only serve to 
    remove an account from being subscribed to the recipie.
 */
router.delete('/:id', catchAsync(async (req, res) => {

    return res.status(200).json({  });
}));

export default router;