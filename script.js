let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalPrice = cart.reduce((total, item) => total + item.price, 0);

function addToCart(product, price) {
  cart.push({ product, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // SweetAlert untuk notifikasi
  Swal.fire({
    title: "Berhasil!",
    text: `${product} berhasil ditambahkan ke keranjang!`,
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  });
}


function renderCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return;

  cartItems.innerHTML = "";
  totalPrice = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.product} - Rp${item.price}`;
    cartItems.appendChild(li);
    totalPrice += item.price;
  });

  document.getElementById("total").textContent = `Total: Rp${totalPrice}`;
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

function clearCart() {
  if (cart.length === 0) {
    Swal.fire({
      title: "Keranjang Kosong!",
      text: "Keranjang Anda sudah kosong.",
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  Swal.fire({
    title: "Kosongkan Keranjang?",
    text: "Apakah Anda yakin ingin menghapus semua item dari keranjang?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, kosongkan!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();

      Swal.fire({
        title: "Keranjang Dikosongkan!",
        text: "Semua item di keranjang telah dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}


function checkout() {
  if (cart.length === 0) {
    Swal.fire({
      title: "Keranjang Kosong!",
      text: "Silakan tambahkan item ke keranjang sebelum checkout.",
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  
  let message = "Halo, saya ingin konfirmasi pesanan berikut:\n";
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.product} - Rp${item.price}\n`;
  });
  message += `\nTotal: Rp${totalPrice}`;

  const encodedMessage = encodeURIComponent(message);

  Swal.fire({
    title: "Konfirmasi Pesanan",
    text: "Pesanan Anda akan dikonfirmasi melalui:",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "WhatsApp",
    cancelButtonText: "Telegram",
  }).then((result) => {
    if (result.isConfirmed) {
      const whatsappNumber = "6288294951448";
      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      const telegramUsername = "FizzxDevv";
      window.location.href = `https://t.me/${telegramUsername}?text=${encodedMessage}`;
    }
  });

  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

document.getElementById("clear-cart")?.addEventListener("click", clearCart);
renderCart();
updateCartCount();
