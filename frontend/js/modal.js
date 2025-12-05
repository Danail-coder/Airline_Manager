/**
 * Modal Helper
 * Provides a reusable showModal function to display styled modals
 * instead of native alerts, confirms, and prompts
 */

(function(window) {
  // Create modal styles dynamically
  const styleId = 'modal-styles';
  if (!document.getElementById(styleId)) {
    const styles = `
      #modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      #modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .modal-content {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease;
        z-index: 1001;
      }

      @keyframes slideUp {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .modal-header {
        margin-bottom: 1rem;
      }

      .modal-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a73e8;
        margin: 0;
      }

      .modal-message {
        font-size: 1rem;
        color: #4b5563;
        line-height: 1.5;
        margin: 1rem 0;
        word-wrap: break-word;
        white-space: pre-wrap;
      }

      .modal-buttons {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
      }

      .modal-button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .modal-button-primary {
        background: #1a73e8;
        color: white;
      }

      .modal-button-primary:hover {
        background: #1557c0;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
      }

      .modal-button-secondary {
        background: #e8eef5;
        color: #1a73e8;
      }

      .modal-button-secondary:hover {
        background: #d1d5db;
      }

      .modal-button-danger {
        background: #dc2626;
        color: white;
      }

      .modal-button-danger:hover {
        background: #b91c1c;
      }

      @media (max-width: 640px) {
        .modal-content {
          padding: 1.5rem;
          width: 95%;
        }

        .modal-buttons {
          flex-direction: column-reverse;
        }

        .modal-button {
          width: 100%;
        }
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  // Create modal HTML structure
  function ensureModalDOM() {
    if (document.getElementById('modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="modal-title">Modal</h2>
        </div>
        <p class="modal-message" id="modal-message"></p>
        <div class="modal-buttons" id="modal-buttons"></div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Show modal with custom configuration
  window.showModal = function(options) {
    // Support both old (title, message, actions) and new { title, message, actions } style
    if (typeof options === 'string') {
      options = {
        title: arguments[0],
        message: arguments[1],
        actions: arguments[2]
      };
    }

    ensureModalDOM();

    const overlay = document.getElementById('modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const messageEl = document.getElementById('modal-message');
    const buttonsEl = document.getElementById('modal-buttons');

    titleEl.textContent = options.title || 'Message';
    messageEl.textContent = options.message || '';
    buttonsEl.innerHTML = '';

    const defaultActions = [
      {
        label: 'OK',
        type: 'primary',
        callback: () => {
          overlay.classList.remove('active');
        }
      }
    ];

    const actions = options.actions || defaultActions;

    actions.forEach((action) => {
      const btn = document.createElement('button');
      btn.className = `modal-button modal-button-${action.type || 'primary'}`;
      btn.textContent = action.label || 'OK';
      btn.addEventListener('click', () => {
        overlay.classList.remove('active');
        if (action.callback) action.callback();
      });
      buttonsEl.appendChild(btn);
    });

    // Close on overlay click (but not if there are custom action buttons)
    const hasCustomActions = actions && actions.length > 0 && actions.some(a => a.callback);
    if (!hasCustomActions) {
      const overlayClickHandler = (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
          overlay.removeEventListener('click', overlayClickHandler);
        }
      };
      overlay.addEventListener('click', overlayClickHandler);
    }

    overlay.classList.add('active');
  };

  // Convenience functions for common use cases
  window.showInfo = function(title, message, actions) {
    showModal({ title, message, actions: actions || [{ label: 'OK', type: 'primary' }] });
  };

  window.showError = function(title, message, actions) {
    showModal({ title, message, actions: actions || [{ label: 'Close', type: 'danger' }] });
  };

  window.showSuccess = function(title, message, actions) {
    showModal({ title, message, actions: actions || [{ label: 'OK', type: 'primary' }] });
  };

  window.showConfirm = function(title, message, onConfirm, onCancel) {
    showModal({
      title,
      message,
      actions: [
        { label: 'Cancel', type: 'secondary', callback: onCancel },
        { label: 'Confirm', type: 'primary', callback: onConfirm }
      ]
    });
  };
})(window);
