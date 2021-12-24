const stripe = Stripe(process.env.PUBLISHABLE_KEY);
const elements = stripe.elements();

let style = {
    base: {
        color: "#fff",
        fontSize: '16px',
    }
};

const card = elements.create('card', { style });
card.mount('#card-element');

const form = document.querySelector('form');
const error1 = document.querySelector('#card-errors');

const stripeTokenHandler = token => {
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    form.submit();
}

form.addEventListener('submit', e => {
    e.preventDefault();

    stripe.createToken(card).then(res => {
        if (res.error) error1.textContent = res.error.message;
        else stripeTokenHandler(res.token);
    });
});
