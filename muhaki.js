const stockLimits = {
  "White glass Mousepad": 10,
  "Black glass Mousepad": 5,
  "white Mousepad": 5,
  "Gray Mousepad": 5,
  "Black Mousepad": 5,
};
// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update the cart count badge
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = count;
  updateStockDisplay();

}
// Add item to cart
function addToCart(productName, price) {
  const maxQuantity = stockLimits[productName] || 1;
  const existingItem = cart.find(item => item.name === productName);

  if (existingItem) {
    if (existingItem.quantity >= maxQuantity) {
      alert(`❌ Only ${maxQuantity} pieces available for "${productName}"`);
      return;
    }
    existingItem.quantity += 1;
  } else {
    cart.push({ name: productName, price: price, quantity: 1 });
  }
 
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCart();
  flyImageToCart(productName);
  updateStockDisplay(); // <-- update stock text here
}


  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCart();
  updateStockDisplay();

  // طيران الصورة نحو زر العربة
  flyImageToCart(productName);


// Show the cart sidebar with items
function showCart() {
  const cartItemsUl = document.getElementById('cartItems');
  const cartTotalP = document.getElementById('cartTotal');
  //cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartItemsUl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsUl.innerHTML = '<li>Your cart is empty.</li>';
    cartTotalP.textContent = '';
  } else {
    let total = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.name} - ${item.quantity} × ${item.price.toFixed(3)} OMR = ${itemTotal.toFixed(3)} OMR
        <button onclick="updateQuantity('${item.name}', 1)">+</button>
        <button onclick="updateQuantity('${item.name}', -1)">-</button>
      `;
      cartItemsUl.appendChild(li);
    });

    const deliveryFee = getSelectedDeliveryFee();
    const deliveryText = getSelectedDeliveryText();
    const finalTotal = total + deliveryFee;

    cartTotalP.innerHTML = `
      Subtotal: ${total.toFixed(3)} OMR<br/>
      Delivery: ${deliveryText}<br/>
      <strong>Total: ${finalTotal.toFixed(3)} OMR</strong>
    `;
  }
}

// Update item quantity in the cart
//function updateQuantity(productName, change) {
  //cart = JSON.parse(localStorage.getItem('cart')) || [];
  //const item = cart.find(i => i.name === productName);
  //if (item) {
    //item.quantity += change;
   // if (item.quantity <= 0) {
    //  cart = cart.filter(ino => ino.name !== productName);
   // }
   // localStorage.setItem('cart', JSON.stringify(cart));
//updateCartCount();
  //  showCart();
 // }
//}
function updateQuantity(productName, change) {
  const item = cart.find(i => i.name === productName);
  if (item) {
    const maxQuantity = stockLimits[productName] || 1;

    const newQuantity = item.quantity + change;
    if (newQuantity > maxQuantity) {
      alert(`❌ Only ${maxQuantity} pieces available for "${productName}"`);
      return;
    }

    item.quantity = newQuantity;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.name !== productName);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart();
    updateStockDisplay();
  }
}

function updateStockDisplay() {
  const stockEls = document.querySelectorAll(".stock");
  stockEls.forEach(el => {
    const product = el.dataset.product;
    const max = stockLimits[product] || 1;
    const inCart = cart.find(item => item.name === product)?.quantity || 0;
    const remaining = max - inCart;

    if (remaining <= 0) {
      el.textContent = "Out of stock";
      el.classList.add("out");
    } else {
      el.textContent = `Only ${remaining} pieces available`;
      el.classList.remove("out");
    }
  });
}


function getSelectedDeliveryText() {
  const radios = document.getElementsByName('delivery');
  for (const radio of radios) {
    if (radio.checked) {
      switch (radio.value) {
        case '2': return "Deliver to Home (+2 OMR)";
        case '1': return "Shop Pickup (+1 OMR)";
        case '0': return "Collected from Almawaleh south جنوب الموالح (Free)";
      }
    }
  }
  return "";
}

// WhatsApp order message
function sendCartToWhatsApp() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = "السلام عليكم ورحمة الله وبركاته، اود ان اطلب المنتج/ات التالي/ة  من متجر مُحاكي:%0A";
  cart.forEach(item => {
    message += `- ${item.name} (الكمية: ${item.quantity}) - السعر لكل وحدة: ${item.price.toFixed(3)} OMR%0A`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = getSelectedDeliveryFee();
  const deliveryText = getSelectedDeliveryText();
  const finalTotal = total + deliveryFee;

  message += `%0Aخيار التوصيل: ${deliveryText}%0A`;
  message += `الإجمالي مع التوصيل: ${finalTotal.toFixed(3)} OMR`;

  const phoneNumber = "96876909888";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappURL, '_blank');
}

// Sidebar toggle
//function openSidebar() {
  //document.getElementById('cartSidebar').classList.add('open');
 // showCart();
//}
function toggleSidebar() {
  const sidebar = document.getElementById('cartSidebar');
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  } else {
    sidebar.classList.add('open');
    showCart();
    
  }
}

function closeSidebar() {
  document.getElementById('cartSidebar').classList.remove('open');
}

// Clear cart
function clearCart() {
  localStorage.removeItem('cart');
  cart = [];
  updateCartCount();
  showCart();
  alert('Cart cleared!');
}
function flyImageToCart(productName) { 
  const productItems = document.querySelectorAll(".works li"); 
  let targetImg = null; 
 
  productItems.forEach(item => { 
    const btn = item.querySelector("button"); 
    if (btn.textContent.includes(productName)) { 
      targetImg = item.querySelector("img"); 
    } 
  }); 
 
  if (!targetImg) return; 
 
  const imgRect = targetImg.getBoundingClientRect(); 
  const cartBtn = document.querySelector(".floatingCartBtn"); 
  const cartRect = cartBtn.getBoundingClientRect(); 
 
  const flyingImg = targetImg.cloneNode(true); 
  flyingImg.classList.add("fly-to-cart"); 
  flyingImg.style.left = `${imgRect.left}px`; 
  flyingImg.style.top = `${imgRect.top}px`; 
  flyingImg.style.width = `${imgRect.width}px`; 
  flyingImg.style.height = `${imgRect.height}px`; 
  flyingImg.style.position = "fixed"; 
 
  document.body.appendChild(flyingImg); 
 
  // Force reflow 
  flyingImg.getBoundingClientRect(); 
 
  // move to cart 
  flyingImg.style.transform = `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.1)`; 
  flyingImg.classList.add("end"); 
 
  setTimeout(() => { 
    flyingImg.remove();

    // ✅ إضافة تأثير الاهتزاز إلى زر العربة
    cartBtn.classList.add("bump");
    setTimeout(() => {
      cartBtn.classList.remove("bump");
    }, 400);

  }, 1000); 
}
//if (item.quantity <= 0) {
 // cart = cart.filter(ino => ino.name !== productName);
 // alert(`${productName} تم حذفه من السلة`);
//}
// Run on page load
//window.onload = updateCartCount;
// Add this once after your functions or in window.onload
//window.onload = () => {
  //updateCartCount();
  // Add event listeners to delivery radios to update cart when changed
  //const deliveryRadios = document.getElementsByName('delivery');
  //deliveryRadios.forEach(radio => {
    //radio.addEventListener('change', () => {
      //showCart();
  
  //const translations = {
     // en: {
      //  title: "Available",
      //  cart: "Add to Cart",
      //  price: "Price",
      // أضف كل النصوص التي تريد ترجمتها هنا
     // },
     // ar: {
      //  title: "متوفر",
       // cart: "أضف إلى السلة",
       // price: "السعر",
       // // أضف الترجمات
     // }
   // };

    //let currentLang = "ar"; // اللغة الافتراضية

   // document.getElementById("langToggle").addEventListener("click", () => {
   //   currentLang = currentLang === "ar" ? "en" : "ar";
    //  updateLanguage();
    //});

   // function updateLanguage() {
   //   document.getElementById("langToggle").textContent = currentLang === "ar" ? "English" : "العربية";
    //  document.querySelector(".SectionTitle").textContent = translations[currentLang].title;
    //  
     // // أمثلة:
     // document.querySelectorAll(".price-label").forEach(el => {
    //    el.textContent = translations[currentLang].price;
   //   });

     // document.querySelectorAll(".cart-btn").forEach(el => {
     //   el.textContent = translations[currentLang].cart;
    //  });
   // }

  // تشغيل الترجمة مع أول تحميل
   // window.onload = updateLanguage;
   stockTextEl.classList.toggle('out', remaining <= 0);
   stockSpan.textContent = `Only ${remaining} pieces available`;
   stockSpan.classList.toggle('out', remaining <= 0);
   function checkoutWhatsApp() {
    if (cart.length === 0) {
      alert("سلة الشراء فارغة");
      return;
    }
  
    let message = "🚚 طلب جديد من متجر مُحاكي:\n";
    cart.forEach(item => {
      message += `• ${item.name} × ${item.quantity}\n`;
    });
  
    message += "\n📦 طريقة التوصيل: " + deliveryOption;
    message += "\n🛍️ شكراً لتسوقك معنا!";
  
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "76909888"; // ضع رقمك العماني هنا بدون "+" وبصيغة دولية
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    const stockLimits = {
      productName: 5,
      anotherProduct: 10,
    };
    
    window.open(whatsappLink, '_blank');
  }
  document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.addEventListener('change', updateCartSummary);
    updateCartSummary()
  });
  
  window.onload = () => {
    updateCartCount();
    updateStockDisplay();
    showCart();
  };
  
  
  // Delivery fee and option handling
  function getSelectedDeliveryFee() {
    const radios = document.getElementsByName('delivery');
    const deliveryRadios = document.getElementsByName('delivery');
    deliveryRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        showCart(); // ⬅️ this re-renders cart totals with new delivery
      });
    });
    for (const radio of radios) {
      if (radio.checked) return Number(radio.value);
    }
    return 0;
  }

  
