/* 
  =========================================
  EcoMaterials Platform Interaction Logic
  =========================================
  العربية - اتجاه القراءة من اليمين لليسار (RTL)
  المطور: Antigravity AI
  2026 © EcoMaterials B2B
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. تأثير حركة الـ Navbar عند التمرير (Navbar Scroll Effect)
  const navbar = document.querySelector('.navbar-custom');
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleNavbarScroll);
  // استدعاء أولي لتحديد الحالة عند تحميل الصفحة في منتصفها مثلاً
  handleNavbarScroll();

  // 2. تحديث الرابط النشط في القائمة عند التمرير (ScrollSpy)
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link-custom');

  const scrollSpy = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 150; // offset للتفعيل المبكر

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}` || (currentSectionId === 'hero' && href === '#')) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);

  // 3. تأثير ظهور العناصر عند التمرير (Scroll Reveal using Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        // بمجرد ظهور العنصر، نقوم بإلغاء مراقبته لتحسين الأداء
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // يظهر العنصر عندما يكون 15% منه في الإطار
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 4. عداد الإحصائيات التفاعلي عند الظهور (Stats Counter Animation)
  const counterElements = document.querySelectorAll('.stat-number');
  
  const animateCounter = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // مدة الحركة بالملي ثانية (2 ثانية)
    const startTime = performance.now();
    
    const updateNumber = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // معادلة تيسير الحركة (Ease Out Quad)
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * target;
      
      if (Number.isInteger(target)) {
        element.textContent = prefix + Math.floor(currentValue) + suffix;
      } else {
        element.textContent = prefix + currentValue.toFixed(1) + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        // التأكد من كتابة الرقم النهائي بالضبط عند انتهاء الحركة
        element.textContent = prefix + target + suffix;
      }
    };
    
    requestAnimationFrame(updateNumber);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counterElements.forEach(counter => {
    counterObserver.observe(counter);
  });

  // 5. زر العودة لأعلى (Back to Top Button)
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 6. التحقق من نموذج الاتصال وعرض رسالة النجاح (Contact Form Validation)
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // منع إرسال الصفحة الفعلي
      
      // جلب قيم الحقول
      const name = document.getElementById('fullName').value.trim();
      const company = document.getElementById('companyName').value.trim();
      const email = document.getElementById('emailAddress').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      const type = document.getElementById('factoryType').value;
      const message = document.getElementById('message').value.trim();
      
      let isValid = true;
      let errorMsg = '';

      // التحقق من صحة الاسم
      if (name.length < 3) {
        isValid = false;
        errorMsg = 'يرجى إدخال اسم ثلاثي صحيح لا يقل عن 3 أحرف.';
      }
      // التحقق من اسم الشركة
      else if (company.length < 2) {
        isValid = false;
        errorMsg = 'يرجى إدخال اسم الشركة بشكل صحيح.';
      }
      // التحقق من البريد الإلكتروني بـ Regex بسيط
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        isValid = false;
        errorMsg = 'يرجى إدخال بريد إلكتروني صالح (مثال: name@company.com).';
      }
      // التحقق من رقم الهاتف
      else if (!/^\+?[0-9]{8,15}$/.test(phone)) {
        isValid = false;
        errorMsg = 'يرجى إدخال رقم هاتف صحيح يحتوي على الأرقام فقط (من 8 إلى 15 رقماً).';
      }
      // التحقق من اختيار نوع المنشأة
      else if (type === '') {
        isValid = false;
        errorMsg = 'يرجى تحديد دور المنشأة من القائمة المنسدلة.';
      }
      // التحقق من نص الرسالة
      else if (message.length < 10) {
        isValid = false;
        errorMsg = 'يرجى كتابة رسالة توضيحية لا تقل عن 10 أحرف.';
      }

      // إظهار النتيجة للمستخدم
      if (!isValid) {
        formFeedback.innerHTML = `
          <div class="alert alert-danger d-flex align-items-center gap-2 alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <div>${errorMsg}</div>
            <button type="button" class="btn-close ms-auto me-0" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      } else {
        // في حالة النجاح
        formFeedback.innerHTML = `
          <div class="alert alert-success d-flex align-items-center gap-2 alert-dismissible fade show" role="alert" style="border-right: 5px solid var(--primary-color);">
            <i class="bi bi-check-circle-fill" style="color: var(--primary-color); font-size: 1.2rem;"></i>
            <div>
              <strong>تم إرسال طلبك بنجاح!</strong><br>
              شكراً لتواصلك مع EcoMaterials. سيقوم فريق تطوير الأعمال بمراجعة طلبك والتواصل معك خلال 24 ساعة لجدولة العرض التجريبي.
            </div>
            <button type="button" class="btn-close ms-auto me-0" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        // إعادة تهيئة الفورم
        contactForm.reset();
      }

      // التمرير التلقائي لرسالة النتيجة لتظهر بوضوح
      formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // 7. تحريك خط تقدم التايملاين عند التمرير عبره
  const timelineProgress = document.querySelector('.timeline-line-progress');
  const timelineSection = document.querySelector('#how-it-works');
  
  if (timelineProgress && timelineSection) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // جعل خط تقدم التايملاين يكتمل تدريجياً
          timelineProgress.style.width = '100%';
          
          // تفعيل الخطوات واحدة تلو الأخرى مع تأثير delay خفيف
          const steps = document.querySelectorAll('.timeline-step');
          steps.forEach((step, index) => {
            setTimeout(() => {
              step.classList.add('active');
              // تفعيل خطوة الـ Escrow بلون التمييز (الذهبي)
              if (index === 2) {
                step.classList.add('active-accent');
              }
            }, index * 400); // 400ms تأخير بين كل خطوة
          });
          
          timelineObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });
    
    timelineObserver.observe(timelineSection);
  }
});
