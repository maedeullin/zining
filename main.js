displayProducts2();



let cart = []
let displayedItemIds = new Set();

function startOrder(){
    window.location.reload()
}

document.addEventListener("DOMContentLoaded", ()=>{
    saveItemToLocalStorage(cart)
    
})

function displayProducts2(){
    const cartItems = document.querySelectorAll('.add')
    cartItems.forEach((item)=>{
        item.addEventListener('click', function(){
        const counter = item.nextElementSibling
        const name = item.parentElement.nextElementSibling.children[0].textContent
        let price = item.parentElement.nextElementSibling.children[1].textContent
        price = parseFloat(price.replace('RM', ''))
        const image = item.previousElementSibling.dataset.thumbnailImg
        let count = 1
        if(counter){
            counter.style.display = 'block'
            item.style.display = 'none'
            counter.children[1].textContent = count
            counter.children[2].addEventListener('click', function(){
                count++
                addToCart(name, price, count, image)
                counter.children[1].textContent = count

            })
            counter.children[0].addEventListener('click', function(){
                if(count > 1){
                    
                    count--
                    addToCart(name, price, count, image)
                    counter.children[1].textContent = count
                }else{
                    counter.children[1].textContent = 1
                }
            })
            
        }
        addToCart(name, price, count, image)

        })
    })
}

function saveItemToLocalStorage(items){
    localStorage.setItem('cart', JSON.stringify(items))

}

function getItemFromLocalStorage(){
    const items = JSON.parse(localStorage.getItem('cart'));
    return items
}

function addToCart(product, price, quantity, image){
    document.querySelector('#empty-cart').style.display = 'none';
    cart = getItemFromLocalStorage()
       
    if(cart ){

        let item = cart.find(item => item.name === product)
        
        if(item){ 
            item.quantity = quantity
        }else{
            cart.push({
                name: product,
                price: price,
                quantity: quantity,
                image: image,
            })
        }
        saveItemToLocalStorage(cart)
    
        displayCartItem({name: product, price: price, quantity: item? item.quantity : quantity})
        
        updateCartNumber()

        displayItemsTotal()

    }
}

function updateCartNumber(){
    const products = getItemFromLocalStorage()
    const totalQuantity = products.reduce((total, product) => total + product.quantity, 0)
    const cartNumber = document.querySelector('#cart-no')
    if(cartNumber){
        cartNumber.textContent = totalQuantity;
    }
}

function displayCartItem(product){
    
    const cartProduct = document.querySelector('#product-cart')
    cartProduct.style.display = 'block'
    let item = document.querySelector(`.item[data-name = "${product.name}"]`)
    if(item){
        item.querySelector('.qty').textContent = `${product.quantity}x`
        item.querySelector('.total').textContent = (product.price * product.quantity).toFixed(2)
    }else{
        
        const item = document.createElement('div')
        item.classList.add('item', 'col-12')
        item.dataset.name = product.name
        item.innerHTML += `
        <div class="row">
        <div class="col-10">
                <h6>${product.name}</h6>
                <p><span class="qty">${product.quantity}x</span><span class="price text-muted mx-2">@${product.price.toFixed(2)}</span>
                <span class="total mx-2">RM${(parseFloat(product.price) * parseFloat(product.quantity)).toFixed(2)}</span></p>
            </div>
            <div class="col-2">
                <a href="#" onclick="removeItem('${product.name}')" class="mx-2 mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none"
                        viewBox="0 0 10 10">
                        <path fill="#CAAFA7"
                        d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
                        </svg>
                        
            </div>
            </a>
        </div>
        `
        cartProduct.appendChild(item)
        
    }
    
    
}

function makePayment(email){
    const products = getItemFromLocalStorage()
    const totalAmount = products.reduce((total, product) => total + (product.price * product.quantity), 0)

displayCheckout();

}


function removeItem(name) {
    const products = getItemFromLocalStorage();
    
    const updatedProducts = products.filter(product => product.name !== name);
    
    saveItemToLocalStorage(updatedProducts);
    
    const item = document.querySelector(`.item[data-name="${name}"]`);
    if (item) {
        item.remove();
    }
    
    if (updatedProducts.length === 0) {
        const emptyProduct = document.querySelector('#empty-cart')
        emptyProduct.style.display = 'block'
        startOrder()

    }
    updateCartNumber()
    const cartTotal = updatedProducts.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)
    document.querySelector('#total-order').textContent = `$${cartTotal}`
}

function appendCartItem() {
    const items = getItemFromLocalStorage()
    items.forEach(item => {
        if(!displayedItemIds.has(item.name)) {
            displayCartItem(item)
            displayedItemIds.add(item.name)
            
        }
    })
    console.log(items);
    
}

function displayItemsTotal(){
    const products = getItemFromLocalStorage()
    const totalAmount = products.reduce((total, product) => total + (product.price * product.quantity), 0)
    
    const cartTotal = document.querySelector('#cart-total')
    if(cartTotal){

        cartTotal.innerHTML = `
        <div class="col-12">
        <div class="row">
            <div class="col-9 col-md-7 col-xl-8">
                <p>Order Total</p>
            </div>
            <div class="col-3 col-md-5 col-xl-4">
                <h4 id="total-order">RM${totalAmount.toFixed(2)}</h4>
            </div>
        </div>
        </div>    
        `
    }

    const checkout = document.querySelector('#checkout')
    checkout.style.display = 'block'
    
}

function displayCheckout(){
    $('#checkout-page').modal('show')
    const products = getItemFromLocalStorage()
    const productDisplay = document.querySelector('.checkout-item')
    products.forEach(product=>{
        productDisplay.innerHTML += `
        <div class="row p-3 mb-1 cart-item">
        <div class="col-2">
            <img src="${product.image}" class="img-fluid" alt="">
        </div>
        <div class="col-7">
            <h6>${product.name}</h6>
            <p><span>${product.quantity}x</span> <span>@RM${product.price}</span></p>
        </div>
        <div class="col-3">
            <p>RM${product.price * product.quantity}</p>
        </div>
        </div>
        `
    })
    const orderTotal = document.querySelector('#order-total')
    orderTotal.textContent = `RM${products.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)}`
}

const checkoutForm = document.querySelector('#checkout-form')
checkoutForm.addEventListener('submit', handleCheckoutSubmit)


function handleCheckoutSubmit(event){
    event.preventDefault()
    const email = document.querySelector('#email')
    if(email.value.length === 0){
        email.style.border = '1px solid rgba(238, 40, 40, 0.733)';
        email.style.boxShadow = '1px 2px 2px rgba(248, 133, 133, 0.637)'
    }else{
        makePayment(email.value)
    }
}