import EErrors from "../tools/EErrors.js";

export function errorsManagerMiddleware(err, req, res, next) {
	console.log(err.cause)
    switch (err.code) {
		case EErrors.ROUTING_ERROR:
			res.status(400).send({ status: 'error', error: err.name });
			break;
		case EErrors.INVALID_TYPE:
			res.status(400).send({ status: 'error', error: err.name });
			break;
		case EErrors.DATABASE_ERROR:
			res.status(400).send({ status: 'error', error: err.name });
			break;
		default:
			res.status(400).send({ status: 'error', err: 'Error sin especificar' });
			break;
	} 
}

