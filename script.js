/**
 * Flex Computers - SPA Application Script
 * Modern, accessible, and well-structured JavaScript
 */

// ============================================
// MOCK DATA
// ============================================

const laptops = [
    {
        brand: 'Dell',
        name: 'XPS 15',
        price: 1500,
        code: 'DL-XPS15-01',
        delivery: 'Free Next Day Delivery',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop'
    },
    {
        brand: 'Lenovo',
        name: 'ThinkPad X1',
        price: 1200,
        code: 'LN-TPX1-02',
        delivery: 'Standard Delivery (2-3 days)',
        image: 'https://images.unsplash.com/photo-1588872657840-790ff3bde172?w=400&h=250&fit=crop'
    },
    {
        brand: 'Apple',
        name: 'MacBook Air M2',
        price: 999,
        code: 'AP-MBA-M2',
        delivery: 'Free Next Day Delivery',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop'
    },
    {
        brand: 'Dell',
        name: 'Inspiron 14',
        price: 750,
        code: 'DL-IN14-04',
        delivery: 'Standard Delivery (2-3 days)',
        image: 'https://images.unsplash.com/photo-1588872657840-790ff3bde172?w=400&h=250&fit=crop'
    }
];

const accessories = [
    {
        name: 'Logitech MX Master 3',
        price: 99,
        code: 'AC-MOU-01',
        delivery: 'In Stock',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=250&fit=crop'
    },
    {
        name: 'USB-C Hub Multiport',
        price: 45,
        code: 'AC-HUB-02',
        delivery: 'In Stock',
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=250&fit=crop'
    },
    {
        name: 'Laptop Cooling Pad',
        price: 30,
        code: 'AC-PAD-03',
        delivery: 'Low Stock',
        image: 'https://images.unsplash.com/photo-1587829191301-0151e96e3879?w=400&h=250&fit=crop'
    }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} Escaped HTML-safe string
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Gets all section elements
 * @returns {NodeList} All section elements
 */
function getAllSections() {
    return document.querySelectorAll('.section');
}

/**
 * Gets a section by ID
 * @param {string} sectionId - The section ID
 * @returns {Element|null} The section element or null
 */
function getSection(sectionId) {
    return document.getElementById(sectionId);
}

// ============================================
// NAVIGATION
// ============================================

/**
 * Navigate to a section and update active state
 * @param {string} sectionId - The ID of the section to navigate to
 */
function navigate(sectionId) {
    // Remove active class from all sections
    getAllSections().forEach(section => {
        section.classList.remove('active');
    });

    // Add active class to target section
    const targetSection = getSection(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
    }
}

/**
 * Handle keyboard navigation (Alt + H/L/A for Home/Laptops/Accessories)
 * @param {KeyboardEvent} event - The keyboard event
 */
document.addEventListener('keydown', (event) => {
    if (event.altKey) {
        switch (event.key.toLowerCase()) {
            case 'h':
                event.preventDefault();
                navigate('home');
                break;
            case 'l':
                event.preventDefault();
                navigate('laptops');
                break;
            case 'a':
                event.preventDefault();
                navigate('accessories');
                break;
        }
    }
});

// ============================================
// RENDERING FUNCTIONS
// ============================================

/**
 * Creates a product card HTML string
 * @param {Object} item - Product data object
 * @param {string} type - Product type ('laptop' or 'accessory')
 * @returns {string} HTML string for the card
 */
function createProductCard(item, type = 'laptop') {
    const title = type === 'laptop'
        ? `${escapeHTML(item.brand)} ${escapeHTML(item.name)}`
        : escapeHTML(item.name);

    return `
        <div class="card" role="article" tabindex="0">
            <img src="${item.image}" alt="${title}" class="card-img" onerror="this.src='https://via.placeholder.com/400x250?text=Product+Image'">
            <div class="card-content">
                <div class="card-title">${title}</div>
                <div class="card-code">Code: ${escapeHTML(item.code)}</div>
                <div class="card-price">$${item.price}</div>
                <div class="card-delivery">${escapeHTML(item.delivery)}</div>
            </div>
        </div>
    `;
}

/**
 * Renders laptop products to the grid
 * @param {Array} data - Array of laptop objects
 */
function renderLaptops(data) {
    const grid = document.getElementById('laptopGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6B7280;">No laptops match your filters.</p>';
        return;
    }

    data.forEach(item => {
        grid.innerHTML += createProductCard(item, 'laptop');
    });
}

/**
 * Renders accessory products to the grid
 */
function renderAccessories() {
    const grid = document.getElementById('accessoriesGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    accessories.forEach(item => {
        grid.innerHTML += createProductCard(item, 'accessory');
    });
}

// ============================================
// FILTERING
// ============================================

/**
 * Gets the current filter values
 * @returns {Object} Object with brandVal and priceVal properties
 */
function getFilterValues() {
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    return {
        brandVal: brandFilter?.value || 'all',
        priceVal: priceFilter?.value || 'all'
    };
}

/**
 * Applies filters to the laptop list and re-renders
 */
function filterProducts() {
    const { brandVal, priceVal } = getFilterValues();
    let filtered = [...laptops];

    // Apply brand filter
    if (brandVal !== 'all') {
        filtered = filtered.filter(laptop => laptop.brand === brandVal);
    }

    // Apply price filter
    if (priceVal === 'low') {
        filtered = filtered.filter(laptop => laptop.price < 1000);
    } else if (priceVal === 'high') {
        filtered = filtered.filter(laptop => laptop.price >= 1000);
    }

    renderLaptops(filtered);
}

/**
 * Resets all filters to default values
 */
function resetFilters() {
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (brandFilter) brandFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';
    
    renderLaptops(laptops);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initializes the application
 * Called when the DOM is fully loaded
 */
function initializeApp() {
    // Render initial product data
    renderLaptops(laptops);
    renderAccessories();

    // Set up event listeners
    setupEventListeners();
}

/**
 * Sets up event listeners for the application
 */
function setupEventListeners() {
    // Filter inputs
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');

    if (brandFilter) {
        brandFilter.addEventListener('change', filterProducts);
    }

    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }

    // Optional: Add smooth scroll to filter results
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
        filterBar.addEventListener('change', () => {
            const grid = document.getElementById('laptopGrid');
            if (grid) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
}

/**
 * DOM Content Loaded Event Handler
 * Initializes the app when the DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}

// ============================================
// EXPORT FOR EXTERNAL USE (if needed)
// ============================================

// Expose public API for external scripts
window.FlexApp = {
    navigate,
    filterProducts,
    resetFilters,
    renderLaptops,
    renderAccessories
};
