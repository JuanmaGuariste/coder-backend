export const generateUserErrorInfo = (user) => {
    return `
    Error con el usuario
    Email > ${user.email} 
    Password > ${user.password}`
}

export const generateProductErrorInfo = (product) => {
	return `Product Creation Error: One or more properties were incomplete or not valid. List of required properties:
    *tittle      : needs to be string, received ${product.title} 
    *description : needs to be string, received ${product.description} 
    *code        : needs to be string, received ${product.code}
    *price       : needs to be number, received ${product.price}
    *status      : needs to be boolean, received ${product.status}
    *stock       : needs to be number, received ${product.stock}
    *category    : needs to be string, received ${product.category}
    *thumbnail   : needs to be array, received ${product.thumbnail}`;
};