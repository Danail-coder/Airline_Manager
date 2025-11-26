(function(window){
  const instances = new Map();

  function resolveElement(selectorOrElement){
    if (!selectorOrElement) return null;
    if (typeof selectorOrElement === 'string') return document.querySelector(selectorOrElement);
    return selectorOrElement;
  }

  const PhoneInit = {
    init(selectorOrElement, opts){
      const el = resolveElement(selectorOrElement);
      if (!el || !window.intlTelInput) return null;
      // Avoid double-init
      if (instances.has(el)) return instances.get(el);

      const iti = window.intlTelInput(el, Object.assign({
        initialCountry: 'auto',
        separateDialCode: true,
        geoIpLookup: function(callback){ callback('us'); },
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
      }, opts || {}));

      instances.set(el, iti);
      return iti;
    },

    getInstance(selectorOrElement){
      const el = resolveElement(selectorOrElement);
      if (!el) return null;
      return instances.get(el) || null;
    },

    getE164(selectorOrElement){
      const inst = this.getInstance(selectorOrElement);
      if (!inst) return null;
      try{
        if (!inst.isValidNumber()) return null;
        return inst.getNumber();
      }catch(e){
        return null;
      }
    }
  };

  window.PhoneInit = PhoneInit;
})(window);
