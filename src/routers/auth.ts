import {Router} from 'express'
import User from 'src/models/user';

const router = Router()

router.post('create',async  (req, res) =>{
    const {email, password, name} = req.body;
    // const newUser = new User({email, password, name});
    // newUser.save()
    const user = await User.create({name, email, password});
    res.json({user});

})

export default router;