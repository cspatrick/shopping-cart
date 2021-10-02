//Load content if document is still loading
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
console.log("my name is not jeff");
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-remove')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

//Check if quantity input is a valid number or greater than 0
function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

//Retrieves item title, price, image source to add to cart
function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

    //Checks if item title is already in cart and alerts user
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to cart')
            return
        }
    }
    var cartRowContents = `   
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}">
            <span class="cart-item-title cart-column">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn-remove" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-remove')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')

    var sTotal = 0;

    var dvdCount = 0;
    var blurayCount = 0;

    var dvdDiscount = 0;
    var blurayDiscount = 0;
    var hundredDiscount = 0;
    var discount = 0;

    var tItems = 0;

    var dvdPrice = 0;
    var blurayPrice = 0;
    var tPrice = 0;
    var dvdQuantity = 0;
    var blurayQuantity = 0;
    var price = 0;

    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

    //Check if all DVDs or Blu-Rays are added to cart
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText.includes('DVD')) {
            dvdCount++;
        } else if (cartItemNames[i].innerText.includes('Blu-Ray')) {
            blurayCount++;
        }
    }

    //Calculates total items, subtotal, discounts, and total price
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]

        if (cartItemNames[i].innerText.includes('DVD')) {
            var dvdQuantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            dvdPrice = parseInt(priceElement.innerText.replace('$', ''))
            dvdQuantity += parseInt(dvdQuantityElement.value)
        } else if (cartItemNames[i].innerText.includes('Blu-Ray')) {
            var blurayQuantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            blurayPrice = parseInt(priceElement.innerText.replace('$', ''))
            blurayQuantity += parseInt(blurayQuantityElement.value)
        }
    }

    //Apply discounts if requirements are met and calculate total price
    if (dvdCount >= 3) {
        dvdDiscount = dvdPrice * dvdQuantity * 0.1
    }
    if (blurayCount >= 3) {
        blurayDiscount = blurayPrice * blurayQuantity * 0.15
    }

    tItems = parseInt(dvdQuantity) + parseInt(blurayQuantity)
    sTotal = (dvdPrice * parseInt(dvdQuantity)) + (blurayPrice * parseInt(blurayQuantity))

    if (tItems >= 100) {
        hundredDiscount = (sTotal - (dvdDiscount + blurayDiscount)) * 0.05
    }
    discount = dvdDiscount + blurayDiscount + hundredDiscount
    discount = (Math.round(discount * 100) / 100)
    tPrice = sTotal - discount
    tPrice = (Math.round(tPrice * 100) / 100)

    document.getElementsByClassName('cart-subtotal-price')[0].innerText = '$' + sTotal
    document.getElementsByClassName('cart-total-items')[0].innerText = tItems
    document.getElementsByClassName('cart-discount-price')[0].innerText = '-$' + discount
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + tPrice
}
