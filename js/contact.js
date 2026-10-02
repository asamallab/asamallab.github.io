/* ASLab Contact — copy email / phone buttons. */
document.querySelectorAll('[data-copy]').forEach(button => {
      button.addEventListener('click', async () => {
        const value = button.dataset.copy;

        try {
          await navigator.clipboard.writeText(value);
        } catch {
          const input = document.createElement('textarea');
          input.value = value;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          input.remove();
        }

        const toast = document.querySelector('#copy-toast');
        toast.textContent = 'Copied';
        toast.classList.add('show');
        window.setTimeout(() => toast.classList.remove('show'), 1600);
      });
    });
