let currentInput = '';
        let operator = '';
        let previousInput = '';
        let shouldResetDisplay = false;
        let lastOperator = '';

        const display = document.getElementById('display');

        function updateDisplay(value) {
            display.textContent = value;
            if (value.length > 12) {
                display.style.fontSize = '1.8rem';
            } else if (value.length > 8) {
                display.style.fontSize = '2rem';
            } else {
                display.style.fontSize = '2.5rem';
            }
        }

        function inputNumber(num) {
            if (shouldResetDisplay) {
                currentInput = '';
                shouldResetDisplay = false;
            }
            
            if (currentInput === '0') {
                currentInput = num;
            } else {
                currentInput += num;
            }
            
            updateDisplay(currentInput);
        }

        function inputDecimal() {
            if (shouldResetDisplay) {
                currentInput = '0';
                shouldResetDisplay = false;
            }
            
            if (currentInput === '') {
                currentInput = '0';
            }
            
            if (currentInput.indexOf('.') === -1) {
                currentInput += '.';
                updateDisplay(currentInput);
            }
        }

        function inputOperator(op) {
            if (currentInput === '' && previousInput === '') {
                return;
            }
            
            if (previousInput !== '' && currentInput !== '' && !shouldResetDisplay) {
                calculate();
            }
            
            if (currentInput !== '') {
                previousInput = currentInput;
                currentInput = '';
            }
            
            operator = op;
            shouldResetDisplay = false;
            
            // Visual feedback for active operator
            clearOperatorHighlight();
            const activeBtn = document.querySelector(`[data-key="${op}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }

        function clearOperatorHighlight() {
            document.querySelectorAll('.operator').forEach(btn => {
                btn.classList.remove('active');
            });
        }

        function calculate() {
            if (previousInput === '' || operator === '') {
                return;
            }
            
            if (currentInput === '') {
                currentInput = previousInput;
            }
            
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            let result;
            
            try {
                switch (operator) {
                    case '+':
                        result = prev + current;
                        break;
                    case '-':
                        result = prev - current;
                        break;
                    case '*':
                        result = prev * current;
                        break;
                    case '/':
                        if (current === 0) {
                            throw new Error('Division by zero');
                        }
                        result = prev / current;
                        break;
                    default:
                        return;
                }
                
                // Handle floating point precision
                result = Math.round(result * 1000000000000) / 1000000000000;
                
                currentInput = result.toString();
                updateDisplay(currentInput);
                
                previousInput = '';
                operator = '';
                shouldResetDisplay = true;
                clearOperatorHighlight();
                
            } catch (error) {
                updateDisplay('Error');
                display.classList.add('error');
                setTimeout(() => {
                    display.classList.remove('error');
                    clearAll();
                }, 1500);
            }
        }

        function clearAll() {
            currentInput = '';
            previousInput = '';
            operator = '';
            shouldResetDisplay = false;
            updateDisplay('0');
            clearOperatorHighlight();
        }

        function clearEntry() {
            currentInput = '';
            updateDisplay('0');
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Prevent default behavior for calculator keys
            if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
                event.preventDefault();
            }
            
            // Visual feedback
            const button = document.querySelector(`[data-key="${key}"]`) || 
                          document.querySelector(`[data-key="Enter"]`);
            
            if (button) {
                button.classList.add('pressed');
                setTimeout(() => button.classList.remove('pressed'), 150);
            }
            
            // Handle key input
            if ('0123456789'.includes(key)) {
                inputNumber(key);
            } else if (key === '.') {
                inputDecimal();
            } else if ('+-*/'.includes(key)) {
                inputOperator(key);
            } else if (key === 'Enter' || key === '=') {
                calculate();
            } else if (key === 'Escape') {
                clearAll();
            } else if (key === 'Backspace') {
                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                    updateDisplay(currentInput);
                } else {
                    currentInput = '';
                    updateDisplay('0');
                }
            }
        });

        // Initialize display
        updateDisplay('0');