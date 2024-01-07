import {getUserCurrent as getUserCurrentService} from "../services/users.service.js";

export const getUserCurrent= async (req, res) => {
    try{
    const email=req.user.email;
    const user = await getUserCurrentService(email);
    return res.status(200).send({status: "success", payload:user})}
    catch(error) {return res.send({ status: 'error', error: error })}
}

