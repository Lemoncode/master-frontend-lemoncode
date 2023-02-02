class CartStorage
{
    find(productID) {
        let products = JSON.parse(localStorage.get('cart', []));
        return products.find( p => p.id === productID);
    }

    add(product){/*...*/}
    update(product){/*...*/}
    remove(product){/*...*/}
}
