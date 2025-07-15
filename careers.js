function toggleMenu() {
  document.querySelector('.navbar').classList.toggle('active');
}

function toggleLoginModal() {
  const modal = document.getElementById('loginModal');
  modal?.classList.toggle('hidden');
}
