const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expenses-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("Description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    if (description === "" || isNaN(amount)) return;

    const transaction = {
        id: Date.now(),
        description,
        amount,
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
    transactionFormEl.reset();
}

function updateTransactionList() {
    transactionListEl.innerHTML = "";

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) => {
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);
    });
}

function createTransactionElement(transaction) {
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expenses");

    li.innerHTML = `
        <div class="details">
            <h3>${transaction.description}</h3>
            <p>${transaction.amount > 0 ? "+" : "-"}$${Math.abs(transaction.amount).toFixed(2)}</p>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
        </div>
    `;

    return li;
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}

function updateSummary() {
    const incomeAmount = transactions
        .filter(t => t.amount > 0)
        .reduce((acc, t) => acc + t.amount, 0);

    const expenseAmount = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = incomeAmount + expenseAmount;

    incomeAmountEl.textContent = `$${incomeAmount.toFixed(2)}`;
    expenseAmountEl.textContent = `$${Math.abs(expenseAmount).toFixed(2)}`;
    balanceEl.textContent = `$${balance.toFixed(2)}`;
}

// Initial UI load
updateTransactionList();
updateSummary();
