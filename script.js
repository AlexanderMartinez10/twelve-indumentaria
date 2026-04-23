// =============================================
// ESTADO GLOBAL Y DATOS INICIALES
// =============================================

let defaultProducts = [
    {
        id: 1,
        name: "Pijama Nene Space Blue",
        category: "pijamas-nene",
        price: 45900,
        stock: 12,
        image: "PIJAMA NENE 1.jpeg",
        sizes: ["2", "4", "6", "8"],
        isNew: true,
        description: "Pijama de algodón premium con diseño espacial. Ultra suave para el mejor descanso."
    },
    {
        id: 2,
        name: "Pijama Nene Dino Neon",
        category: "pijamas-nene",
        price: 42500,
        stock: 8,
        image: "PIJAMA 2 NENE.jpeg",
        sizes: ["4", "6", "8", "10"],
        isNew: false,
        description: "Divertido diseño de dinosaurios que brillan en la oscuridad. Tela térmica ligera."
    },
    {
        id: 3,
        name: "Pijama Nena Pink Dream",
        category: "pijamas-nena",
        price: 45900,
        stock: 15,
        image: "PIJAMA NENA 1.jpeg",
        sizes: ["2", "4", "6", "8"],
        isNew: true,
        description: "Diseño delicado en rosa pastel con detalles en neón. Algodón 100% hipoalergénico."
    },
    {
        id: 4,
        name: "Pijama Nena Magic Night",
        category: "pijamas-nena",
        price: 43900,
        stock: 10,
        image: "PIJAMA NENA 2.jpeg",
        sizes: ["4", "6", "8", "12"],
        isNew: false,
        description: "Estampado de estrellas mágicas. Corte cómodo para libertad de movimiento."
    },
    {
        id: 5,
        name: "Pijama Nena Rainbow Glow",
        category: "pijamas-nena",
        price: 46500,
        stock: 5,
        image: "PIJAMA 3 NENA.jpeg",
        sizes: ["6", "8", "10"],
        isNew: true,
        description: "Edición limitada con colores vibrantes y terminaciones reforzadas."
    },
    {
        id: 6,
        name: "Hoodie Twelve Eclipse",
        category: "hoodies",
        price: 89900,
        stock: 20,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&h=600&auto=format&fit=crop",
        sizes: ["S", "M", "L", "XL"],
        isNew: true,
        description: "Buzo oversize con logo bordado en rosa neón. Algodón rústico pesado."
    },
    {
        id: 7,
        name: "Remera Boxy Cyan",
        category: "remeras",
        price: 35000,
        stock: 30,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&h=600&auto=format&fit=crop",
        sizes: ["M", "L", "XL"],
        isNew: false,
        description: "Remera corte boxy fit con estampa en espalda reflectiva."
    }
];

let products = JSON.parse(localStorage.getItem('twelve_products')) || defaultProducts;
let cart = JSON.parse(localStorage.getItem('twelve_cart')) || [];
let currentTheme = localStorage.getItem('twelve_theme') || 'dark';
let adminLoggedIn = false;
let logoClickCount = 0;
let logoClickTimer = null;
let selectedSize = null;

// =============================================
// INICIALIZACIÓN
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    renderProducts(products);
    renderCategoryFilters();
    updateCartBadge();
    initHotDrop();
    
    // Guardar productos iniciales si no existen
    if (!localStorage.getItem('twelve_products')) {
        localStorage.setItem('twelve_products', JSON.stringify(defaultProducts));
    }
});

// =============================================
// NAVEGACIÓN Y TEMA
// =============================================

function navigateToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = section.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('twelve_theme', currentTheme);
    applyTheme();
    showToast(`Modo ${currentTheme === 'dark' ? 'Oscuro' : 'Claro'} activado`);
}

function applyTheme() {
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        document.getElementById('theme-icon').textContent = '🌙';
    } else {
        document.documentElement.classList.remove('light-mode');
        document.getElementById('theme-icon').textContent = '☀️';
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// =============================================
// RENDERIZADO DE TIENDA
// =============================================

function renderProducts(items) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-20 text-center space-y-4">
                <p class="text-3xl opacity-20 font-bold uppercase tracking-widest">No se encontraron productos</p>
                <button onclick="resetFilters()" class="text-[#00f7ff] text-xs font-bold tracking-[2px] uppercase hover:underline">Ver todo el catálogo</button>
            </div>
        `;
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card group relative border border-white/5 rounded-[32px] overflow-hidden cursor-pointer';
        card.onclick = () => openProductModal(product.id);
        
        card.innerHTML = `
            <div class="aspect-square overflow-hidden relative">
                ${product.isNew ? `<span class="absolute top-5 left-5 z-10 bg-[#ff00c1] text-white text-[9px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg">Nuevo</span>` : ''}
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="bg-white text-black font-bold px-8 py-3 rounded-2xl text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">VER DETALLES</span>
                </div>
            </div>
            <div class="p-6 md:p-8 space-y-4 bg-black/20 backdrop-blur-sm">
                <div class="flex justify-between items-start gap-2">
                    <h3 class="font-bold text-lg md:text-xl leading-tight">${product.name}</h3>
                    <span class="text-[9px] font-bold tracking-[2px] text-white/30 uppercase shrink-0 mt-1">${product.category.replace('-', ' ')}</span>
                </div>
                <div class="flex justify-between items-end pt-2">
                    <p class="text-2xl font-bold tracking-tighter">$${product.price.toLocaleString('es-AR')}</p>
                    <span class="text-[10px] font-bold tracking-[1px] ${product.stock > 0 ? 'text-emerald-400' : 'text-red-500'} uppercase">
                        ${product.stock > 0 ? `${product.stock} DISP.` : 'AGOTADO'}
                    </span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    const categories = ['todos', ...new Set(products.map(p => p.category))];
    
    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'px-6 py-3 rounded-2xl text-[10px] font-bold tracking-[2px] uppercase transition-all border border-white/5 hover:bg-white hover:text-black';
        btn.textContent = cat.replace('-', ' ');
        btn.onclick = () => filterByCategory(cat);
        container.appendChild(btn);
    });
}

function filterByCategory(cat) {
    if (cat === 'todos') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === cat);
        renderProducts(filtered);
    }
}

function filterProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    renderProducts(products);
}

// =============================================
// MODAL DE PRODUCTO
// =============================================

function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    selectedSize = null;
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <button onclick="closeProductModal()" class="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
                <img src="${product.image}" class="w-full h-full object-cover">
            </div>
            
            <div class="space-y-8">
                <div class="space-y-2">
                    <span class="text-[#00f7ff] text-[10px] font-bold tracking-[4px] uppercase">${product.category.replace('-', ' ')}</span>
                    <h2 class="title-font text-5xl md:text-6xl tracking-tight leading-none">${product.name}</h2>
                </div>
                
                <p class="text-6xl font-bold tracking-tighter">$${product.price.toLocaleString('es-AR')}</p>
                
                <p class="text-white/60 text-lg leading-relaxed">${product.description}</p>
                
                <div class="space-y-4">
                    <p class="text-[10px] font-bold tracking-[3px] text-white/40 uppercase">Seleccionar Talle</p>
                    <div class="flex flex-wrap gap-3">
                        ${product.sizes.map(size => `
                            <button onclick="selectSize(this, '${size}')" 
                                    class="size-btn px-6 py-4 rounded-2xl border border-white/10 text-sm font-bold transition-all hover:border-[#00f7ff]">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="pt-8">
                    <button onclick="addToCart(${product.id})" 
                            class="w-full py-6 bg-gradient-to-r from-[#ff00c1] to-[#00f7ff] text-black font-bold text-xl rounded-3xl transform active:scale-95 transition-transform">
                        AGREGAR AL CARRITO
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function selectSize(btn, size) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSize = size;
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// =============================================
// CARRITO DE COMPRAS
// =============================================

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const backdrop = document.getElementById('cart-backdrop');
    
    if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
        backdrop.classList.remove('hidden');
        renderCart();
    } else {
        sidebar.classList.add('translate-x-full');
        backdrop.classList.add('hidden');
    }
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (!selectedSize) {
        showToast("Por favor selecciona un talle", true);
        return;
    }

    const existing = cart.find(item => item.id === id && item.size === selectedSize);
    
    if (existing) {
        if (existing.quantity >= product.stock) {
            showToast("No hay más stock disponible", true);
            return;
        }
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: 1
        });
    }

    saveCart();
    updateCartBadge();
    showToast(`¡${product.name} añadido!`);
    if (document.getElementById('product-modal').classList.contains('flex')) {
        closeProductModal();
    }
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    
    container.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center space-y-6 opacity-20">
                <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <p class="font-bold tracking-[4px] uppercase text-center">Tu carrito está vacío</p>
            </div>
        `;
        subtotalEl.textContent = `$ 0`;
        return;
    }

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'flex gap-6 items-center animate-slideIn';
        itemEl.innerHTML = `
            <div class="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                <img src="${item.image}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 space-y-2">
                <div class="flex justify-between">
                    <h4 class="font-bold text-sm uppercase tracking-wider">${item.name}</h4>
                    <button onclick="removeFromCart(${index})" class="opacity-30 hover:opacity-100 transition-opacity">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
                <p class="text-[10px] font-bold tracking-[2px] text-white/30 uppercase">Talle ${item.size}</p>
                <div class="flex justify-between items-center">
                    <div class="flex items-center bg-white/5 rounded-xl border border-white/5">
                        <button onclick="updateQty(${index}, -1)" class="px-3 py-1 hover:text-[#00f7ff]">-</button>
                        <span class="px-3 text-xs font-mono font-bold">${item.quantity}</span>
                        <button onclick="updateQty(${index}, 1)" class="px-3 py-1 hover:text-[#ff00c1]">+</button>
                    </div>
                    <p class="font-bold text-lg tracking-tight">$${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                </div>
            </div>
        `;
        container.appendChild(itemEl);
    });

    subtotalEl.textContent = `$ ${subtotal.toLocaleString('es-AR')}`;
}

function updateQty(index, delta) {
    const item = cart[index];
    const product = products.find(p => p.id === item.id);
    
    if (item.quantity + delta > product.stock) {
        showToast("Máximo stock disponible alcanzado", true);
        return;
    }
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart();
    updateCartBadge();
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count-badge');
    const total = cart.reduce((acc, item) => acc + item.quantity, 0);
    badge.textContent = total;
}

function saveCart() {
    localStorage.setItem('twelve_cart', JSON.stringify(cart));
}

function proceedToCheckout() {
    if (cart.length === 0) return;

    let message = `*TWELVE INDUMENTARIA* ⚡\n\n_Nuevo pedido desde la web:_\n\n`;
    let total = 0;

    cart.forEach(item => {
        message += `• *${item.name}* (Talle ${item.size})\n   Cantidad: ${item.quantity}\n   Subtotal: $${(item.price * item.quantity).toLocaleString('es-AR')}\n\n`;
        total += item.price * item.quantity;
    });

    message += `*TOTAL: $${total.toLocaleString('es-AR')}*\n\n_Enviado desde Corrientes, AR_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5493794881234?text=${encoded}`, '_blank');
    
    // Opcional: Limpiar carrito tras pedido
    // cart = [];
    // saveCart();
    // updateCartBadge();
    // toggleCart();
}

// =============================================
// HOT DROP TIMER
// =============================================

function initHotDrop() {
    let stock = 23;
    const stockText = document.getElementById('hot-drop-stock-text');
    const stockBar = document.getElementById('hot-drop-stock-bar');
    
    setInterval(() => {
        if (stock > 3) {
            stock -= Math.random() > 0.7 ? 1 : 0;
            stockText.textContent = `${stock} UNIDADES`;
            stockBar.style.width = `${(stock / 30) * 100}%`;
        }
    }, 5000);
}

function viewHotDropDetail() {
    openProductModal(2); // ID del Pijama Nene Dino Neon
}

function addHotDropToCart() {
    selectedSize = "L"; // Default size for hot drop buttons
    addToCart(2);
}

// =============================================
// PANEL DE ADMINISTRACIÓN (LOGICA SECRETA)
// =============================================

function handleLogoClick() {
    logoClickCount++;
    if (logoClickTimer) clearTimeout(logoClickTimer);
    
    logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
    }, 800); // Aumentado para mayor facilidad
    
    if (logoClickCount === 3) {
        logoClickCount = 0;
        if (!adminLoggedIn) {
            showLoginModal();
        } else {
            showAdminPanel();
        }
    }
}

function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function hideLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function attemptAdminLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    
    // Credenciales por defecto
    if (user === 'admin' && pass === 'twelve12') {
        adminLoggedIn = true;
        hideLoginModal();
        showAdminPanel();
        showToast("Acceso de administrador concedido");
    } else {
        showToast("Credenciales incorrectas", true);
    }
}

function showAdminPanel() {
    document.getElementById('admin-panel').classList.remove('hidden');
    renderAdminTable();
}

function hideAdminPanel() {
    document.getElementById('admin-panel').classList.add('hidden');
}

function logoutAdmin() {
    adminLoggedIn = false;
    hideAdminPanel();
    showToast("Sesión cerrada");
}

function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-white/5';
        tr.innerHTML = `
            <td class="px-8 py-4">
                <div class="flex items-center gap-4">
                    <img src="${product.image}" class="w-10 h-10 rounded-lg object-cover">
                    <span class="font-bold">${product.name}</span>
                </div>
            </td>
            <td class="py-4 uppercase text-[10px] tracking-wider text-white/40">${product.category}</td>
            <td class="py-4 text-right font-bold">$${product.price.toLocaleString('es-AR')}</td>
            <td class="py-4 text-right font-mono">${product.stock}</td>
            <td class="px-8 py-4 text-center">
                <div class="flex justify-center gap-4">
                    <button onclick="editProduct(${product.id})" class="text-[#00f7ff] hover:underline">Editar</button>
                    <button onclick="deleteProduct(${product.id})" class="text-[#ff00c1] hover:underline">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function handleAdminForm(e) {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const newProduct = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('admin-name').value,
        category: document.getElementById('admin-category').value,
        price: parseInt(document.getElementById('admin-price').value),
        stock: parseInt(document.getElementById('admin-stock').value),
        sizes: document.getElementById('admin-sizes').value.split(',').map(s => s.trim()),
        image: document.getElementById('admin-image-url').value || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600&h=600&auto=format&fit=crop",
        isNew: document.getElementById('admin-is-new').checked,
        description: "Producto gestionado desde el panel de administración."
    };

    if (id) {
        const index = products.findIndex(p => p.id === parseInt(id));
        products[index] = newProduct;
    } else {
        products.unshift(newProduct);
    }

    localStorage.setItem('twelve_products', JSON.stringify(products));
    renderProducts(products);
    renderAdminTable();
    cancelAdminForm();
    showToast("Inventario actualizado");
}

function editProduct(id) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    
    document.getElementById('edit-id').value = p.id;
    document.getElementById('admin-name').value = p.name;
    document.getElementById('admin-category').value = p.category;
    document.getElementById('admin-price').value = p.price;
    document.getElementById('admin-stock').value = p.stock;
    document.getElementById('admin-sizes').value = p.sizes.join(', ');
    document.getElementById('admin-image-url').value = p.image;
    document.getElementById('admin-is-new').checked = p.isNew;
    
    document.getElementById('admin-form-title').textContent = "Editar Producto";
}

function deleteProduct(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('twelve_products', JSON.stringify(products));
        renderProducts(products);
        renderAdminTable();
        showToast("Producto eliminado");
    }
}

function cancelAdminForm() {
    document.getElementById('admin-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('admin-form-title').textContent = "Nuevo Producto";
}

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "twelve_inventory.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// =============================================
// UTILIDADES
// =============================================

function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast flex items-center justify-between gap-4 px-8 py-5 rounded-[24px] border border-white/10 backdrop-blur-xl shadow-2xl ${isError ? 'bg-red-500/20 text-red-400' : 'bg-[#00f7ff]/10 text-[#00f7ff]'}`;
    toast.innerHTML = `
        <span class="text-xs font-bold tracking-[2px] uppercase">${message}</span>
        <button onclick="this.parentElement.remove()" class="text-lg">&times;</button>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}
