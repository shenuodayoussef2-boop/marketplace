// ==========================
// Local Storage
// ==========================

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// ==========================
// Authentication
// ==========================

// إنشاء حساب
function register(name, email, password, role) {

    let users = getData("users");

    const exists = users.find(user => user.email === email);

    if (exists) {
        alert("البريد الإلكتروني مستخدم بالفعل");
        return false;
    }

    const user = {
        id: Date.now(),
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString()
    };

    users.push(user);

    saveData("users", users);

    alert("تم إنشاء الحساب بنجاح");

    return true;
}
// تسجيل الدخول
function login(email, password) {

    let users = getData("users");

    const user = users.find(u =>
        u.email === email &&
        u.password === password
    );

    if (!user) {
        alert("البريد أو كلمة المرور غير صحيحة");
        return false;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    alert("تم تسجيل الدخول");

    return user;
}
// المستخدم الحالي
function currentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );

} 
// تسجيل الخروج
function logout() {

    localStorage.removeItem("currentUser");

    alert("تم تسجيل الخروج");

} 
const registerBtn = document.getElementById("registerBtn");

if(registerBtn){

registerBtn.onclick = () => {

const name = document.getElementById("registerName").value;

const email = document.getElementById("registerEmail").value;

const password = document.getElementById("registerPassword").value;

const role = document.getElementById("registerRole").value;

register(name,email,password,role);

};

} 
const loginBtn = document.getElementById("loginBtn");

if(loginBtn){

loginBtn.onclick = ()=>{

const email =
document.getElementById("loginEmail").value;

const password =
document.getElementById("loginPassword").value;

const user = login(email,password);

if(!user) return;

switch(user.role){

case "customer":
showPage("homePage");
break;

case "merchant":
showPage("merchantPage");
break;

case "admin":
showPage("adminPage");
break;

}

};

} 
// ==========================
// Products
// ==========================

function addProduct() {

    const user = currentUser();

    let products = getData("products");

    const product = {

        id: Date.now(),

        name: document.getElementById("productName").value,

        description: document.getElementById("productDescription").value,

        price: Number(document.getElementById("productPrice").value),

        image: document.getElementById("productImage").value,

        category: document.getElementById("productCategory").value,

        sellerId: user.id,

        sellerName: user.name,

        status: "pending",

        createdAt: new Date().toISOString()
        // عرض المنتجات الموافق عليها فقط
        function getApprovedProducts() {

        let products = getData("products");

        return products.filter(product => product.status === "approved"); 

}
    };

    products.push(product);

    saveData("products", products);

    alert("✅ تم إرسال المنتج إلى الأدمن للمراجعة");

}
// ==========================
// Admin System
// ==========================

// عرض المنتجات التي تنتظر موافقة الأدمن
function loadPendingProducts() {

    const container = document.getElementById("pendingProducts");

    if (!container) return;

    const products = getPendingProducts();

    container.innerHTML = "";

    if (products.length === 0) {

        container.innerHTML = "<p>لا توجد منتجات في الانتظار.</p>";

        return;

    }

    products.forEach(product => {

        container.innerHTML += `
            <div class="product-card">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <p>💰 ${product.price} جنيه</p>

                <p>🏪 ${product.sellerName}</p>

                <button onclick="approveProduct(${product.id})">
                    ✅ موافقة
                </button>

                <button onclick="rejectProduct(${product.id})">
                    ❌ رفض
                </button>

            </div>
        `;

    });

}
// عرض المنتجات في الصفحة الرئيسية
function loadProducts() {

    const container = document.getElementById("productsContainer");

    if (!container) return;

    const products = getApprovedProducts();

    container.innerHTML = "";

    if(products.length === 0){

        container.innerHTML = "<p>لا توجد منتجات حالياً.</p>";

        return;

    }

    products.forEach(product=>{

        container.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <h4>${product.price} جنيه</h4>

            <button onclick="addToCart(${product.id})">

                إضافة للسلة

            </button>

        </div>

        `;

    });

}
// ==========================
// Orders System
// ==========================

// إنشاء طلب جديد
function createOrder(productId) {

    const user = currentUser();

    let products = getData("products");
    let orders = getData("orders");

    const product = products.find(p => p.id === productId);

    if (!product) {
        alert("المنتج غير موجود");
        return;
    }

    const order = {

        id: Date.now(),

        customerId: user.id,

        customerName: user.name,

        sellerId: product.sellerId,

        sellerName: product.sellerName,

        productId: product.id,

        productName: product.name,

        price: product.price,

        quantity: 1,

        status: "pending",

        createdAt: new Date().toISOString()

    };

    orders.push(order);

    saveData("orders", orders);

    alert("✅ تم إرسال الطلب إلى التاجر");
    // عرض طلبات التاجر
    function getMerchantOrders() {

    const user = currentUser();

    let orders = getData("orders");

    return orders.filter(order => order.sellerId === user.id);

}
} 
// تحديث حالة الطلب
function loadMerchantOrders() {

    const container = document.getElementById("merchantOrders");

    if (!container) return;

    const orders = getMerchantOrders();

    container.innerHTML = "";

    if (orders.length === 0) {

        container.innerHTML = "<p>لا توجد طلبات.</p>";

        return;

    }

    orders.forEach(order => {

        container.innerHTML += `
            <div class="order-card">

                <h3>${order.productName}</h3>

                <p>👤 ${order.customerName}</p>

                <p>💰 ${order.price} جنيه</p>

                <p>📦 ${order.status}</p>

                <button onclick="updateOrderStatus(${order.id},'accepted')">
                    ✅ قبول
                </button>

                <button onclick="updateOrderStatus(${order.id},'rejected')">
                    ❌ رفض
                </button>

                <button onclick="updateOrderStatus(${order.id},'shipped')">
                    🚚 شحن
                </button>

                <button onclick="updateOrderStatus(${order.id},'delivered')">
                    📦 تسليم
                </button>

            </div>
        `;

    });

}
// ==========================
// Dashboard
// ==========================

// تحديث إحصائيات لوحة الأدمن
function loadDashboard() {

    const users = getData("users");
    const products = getData("products");
    const orders = getData("orders");

    document.getElementById("usersCount").textContent = users.length;

    document.getElementById("productsCount").textContent = products.length;

    document.getElementById("ordersCount").textContent = orders.length;

    const totalRevenue = orders
        .filter(order => order.status === "delivered")
        .reduce((sum, order) => sum + order.price, 0);

    document.getElementById("revenueCount").textContent =
        totalRevenue + " جنيه";

}
