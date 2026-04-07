const Razorpay=require('razorpay')

class RazorpayInstance {
    constructor() {
        this._instance = null;
    }

    getInstance() {
        if (!this._instance) {
            this._instance = new Razorpay({
                key_id: process.env.RAZORPAY_KEY,
                key_secret: process.env.RAZORPAY_SECRET
            });
        }
        return this._instance;
    }

    // Proxy all method calls to the actual instance
    async orders() {
        return this.getInstance().orders;
    }

    __getattr(name) {
        return this.getInstance()[name];
    }
}

const proxyInstance = new Proxy(new RazorpayInstance(), {
    get(target, prop) {
        if (prop === 'getInstance') {
            return target.getInstance.bind(target);
        }
        return target.getInstance()[prop];
    }
});

exports.instance = proxyInstance;