import { CreateUser } from '#/@types/user';
import User from '#/models/user';
import {Router} from 'express';

const router = Router();

    // router.post()

router.post('/create',async  (req: CreateUser, res) =>{
    // console.log('in route')
    const {email, password, name} = req.body;
    // const newUser = new User({email, password, name});
    // newUser.save()
    const user = await User.create({name, email, password});
    res.json({user});
});

export default router;