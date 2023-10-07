export default class SessionsController {
    userSession(req, res) {
        try{
            let user = req.user
            res.status(201).send({ status: "success", user });
        } catch (err) {
            res.status(500).send({ status: "error", error: err })
        }
    }
}