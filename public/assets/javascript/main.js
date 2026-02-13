;(function () {
  var theme = localStorage.getItem('theme') || 'auto'
  switch (theme) {
    case 'light':
      document.documentElement.classList.remove('dark')
      break
    case 'dark':
      document.documentElement.classList.add('dark')
      break
    case 'auto':
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
  }
  var hue = localStorage.getItem('hue') || 280
  document.documentElement.style.setProperty('--hue', hue)
})()


function switchTheme() {
  if (localStorage.theme === 'dark') {
    $(document.documentElement).removeClass('dark');
    localStorage.theme = 'light';
  } else {
    $(document.documentElement).addClass('dark');
    localStorage.theme = 'dark';
  }
}

$(function() {
  $('#scheme-switch').on('click', function() {
    switchTheme();
  });

  $('#nav-menu-switch').on('click', function() {
    $('#nav-menu-panel').toggleClass('float-panel-closed');
  });
});


$(function () {
    // 粒子参数
    const PARTICLE_NUM = 50
    // 颜色使用 oklch，hue 由 html 的 --hue 控制
    function getHue() {
      const html = document.documentElement
      const style = getComputedStyle(html)
      return style.getPropertyValue('--hue').trim() || '325'
    }

    function getParticleColor() {
      const hue = getHue()
      if (getMode() === 'dark') {
        return `oklch(0.85 0.14 ${hue} / 0.22)`
      } else {
        return `oklch(0.75 0.14 ${hue} / 0.45)`
      }
    }
    function getLineColor() {
      const hue = getHue()
      if (getMode() === 'dark') {
        return `oklch(0.85 0.14 ${hue} / 0.10)`
      } else {
        return `oklch(0.75 0.14 ${hue} / 0.18)`
      }
    }
    const PARTICLE_RADIUS = 3
    const LINE_DISTANCE = 150

    const canvas = document.getElementById('particle-canvas')
    const ctx = canvas.getContext('2d')
    let particles = []

    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    function getMode() {
      // 检查 documentElement 是否有 dark class
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }

    function Particle() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.vx = (Math.random() - 0.5) * 0.8
      this.vy = (Math.random() - 0.5) * 0.8
    }

    Particle.prototype.draw = function () {
      ctx.beginPath()
      ctx.arc(this.x, this.y, PARTICLE_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = getParticleColor()
      ctx.fill()
    }

    Particle.prototype.move = function () {
      this.x += this.vx
      this.y += this.vy
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x
          let dy = particles[i].y - particles[j].y
          let dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINE_DISTANCE) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = getLineColor()
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let p of particles) {
        p.move()
        p.draw()
      }
      drawLines()
      requestAnimationFrame(animate)
    }

    function initParticles() {
      particles = []
      for (let i = 0; i < PARTICLE_NUM; i++) {
        particles.push(new Particle())
      }
    }

    // 监听暗黑模式和 --hue 变化，强制刷新粒子颜色
    const observer = new MutationObserver(() => {
      // 触发一次重绘（通过清空并重绘所有粒子）
      // ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 不需要重建粒子，只需下一帧会自动用新颜色绘制
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    initParticles()
    animate()
})




$(function () {
  // 切换搜索面板显示/隐藏
  $('#search-switch').on('click', function () {
    $('#search-panel').toggleClass('float-panel-closed')
  })

  // 添加点击外部区域关闭搜索面板的功能
  $(document).on('click', function (event) {
    // 如果点击的不是搜索面板内的元素，也不是搜索按钮，也不是搜索输入框
    if (
      !$(event.target).closest('#search-panel').length &&
      !$(event.target).closest('#search-switch').length &&
      !$(event.target).closest('#search-bar').length
    ) {
      // 关闭搜索面板
      $('#search-panel').addClass('float-panel-closed')
    }
  })

  // 搜索函数
  function performSearch(query) {
    if (!query || query.trim() === '') {
      $('#search-results').empty()
      return
    }

    // 显示加载状态
    $('#search-results').html(
      '<div class="text-center py-4 text-black/75 dark:text-white/75">搜索中...</div>'
    )

    // 调用搜索API
    $.ajax({
      url: '/api/search',
      method: 'GET',
      data: { q: query },
      headers: {
      },
      success: function (res) {
        const data = res.results || []
        // 清空搜索结果容器
        $('#search-results').empty()

        // 检查是否有结果
        if (!data || data.length === 0) {
          $('#search-results').html(
            '<div class="text-center py-4 text-black/75 dark:text-white/75">没有找到相关结果</div>'
          )
          return
        }

        // 遍历结果并添加到搜索结果容器
        $.each(data, function (index, item) {
          const _highlight = item._highlight || {}

          // 创建临时元素来安全地解析HTML内容
          const titleContainer = $('<div></div>')
          titleContainer.html(_highlight.title || item.title || '')

          const abstractContainer = $('<div></div>')
          abstractContainer.html(_highlight.excerpt || item.excerpt || '')

          // 构建搜索结果项
          var resultItem = $(`
            <a class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]" href="${'/archives/' + item.url}">
              <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                <span class="title-content"></span>
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)] iconify iconify--fa6-solid" width="0.63em" height="1em" viewBox="0 0 320 512">
                  <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256L73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
                </svg>
              </div>
              <div class="transition text-sm text-50 abstract-content">
              </div>
            </a>
          `)

          // 将HTML内容安全地添加到结果项中
          resultItem.find('.title-content').html(titleContainer.html())
          resultItem.find('.abstract-content').html(abstractContainer.html())

          // 添加到结果容器
          $('#search-results').append(resultItem)
        })
      },
      error: function (xhr, status, error) {
        console.error('搜索请求失败:', error)
        $('#search-results').html(
          '<div class="text-center py-4 text-black/75 dark:text-white/75">搜索失败，请稍后重试</div>'
        )
      }
    })
  }

  // 防抖函数，避免频繁请求
  function debounce(func, wait) {
    let timeout
    return function () {
      const context = this
      const args = arguments
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }

  // 为两个搜索输入框添加事件监听
  const debouncedSearch = debounce(performSearch, 300)

  // 大屏幕搜索框
  $('#search-input').on('input', function () {
    const query = $(this).val()
    if (query && query.trim() !== '') {
      // 如果有输入内容，确保搜索面板可见
      $('#search-panel').removeClass('float-panel-closed')
    }
    debouncedSearch(query)
  })

  // 小屏幕搜索框
  $('#search-input-inside').on('input', function () {
    const query = $(this).val()
    debouncedSearch(query)
  })

  // 按下回车键时执行搜索
  $('#search-input, #search-input-inside').on('keypress', function (e) {
    if (e.which === 13) {
      // 回车键的键码是13
      const query = $(this).val()
      performSearch(query)
    }
  })
})


$(function () {
  // 设置面板开关
  $('#display-settings-switch').on('click', function (e) {
    e.stopPropagation()
    $('#display-setting').toggleClass('float-panel-closed')
  })

  // 点击弹框外部关闭面板
  $(document).on('mousedown', function (e) {
    var $panel = $('#display-setting')
    // 只有面板是打开状态才处理
    if (!$panel.hasClass('float-panel-closed')) {
      // 如果点击目标不是面板本身且不在面板内部
      if (
        !$panel.is(e.target) &&
        $panel.has(e.target).length === 0 &&
        !$('#display-settings-switch').is(e.target)
      ) {
        $panel.addClass('float-panel-closed')
      }
    }


    // 关闭 menus 面板
    if (
      !$(event.target).closest('#nav-menu-panel').length
    ) {
      // 关闭 menus 面板
      $('#nav-menu-panel').addClass('float-panel-closed')
    }
  })

  // 阻止点击面板内部冒泡到 document
  $('#display-setting').on('mousedown', function (e) {
    e.stopPropagation()
  })

  // 监听主题色滑块变化
  $('#colorSlider').on('input change', function () {
    var val = $(this).val()
    $('#hueValue').text(val)
    localStorage.setItem('hue', String(val))
    var r = document.querySelector(':root')
    if (r) {
      r.style.setProperty('--hue', String(val))
    }
  })
})


// <!-- pjax 初始化脚本 -->
$(function () {
  // 只对所有 a 标签启用 pjax，排除外部链接和带 target 的链接
  $(document).pjax(
    'a:not([target="_blank"]):not([href^="#"]):not([href^="http"]):not([download])',
    '#pjax-container',
    {
      fragment: '#pjax-container',
      timeout: 8000
    }
  )

  // pjax 完成后重新高亮代码
  $(document).on('pjax:end', function () {
    if (window.hljs) hljs.highlightAll()
  })
})

$(function () {
  $('#back-to-top-btn').click(function () {
    window.scroll({ top: 0, behavior: 'smooth' });
  })
})


// 添加 TOC 链接平滑滚动功能
$(function () {
  // 使用事件委托处理动态添加的 TOC 链接
  $(document).on('click', '#toc-lists a', function (e) {
    // 阻止默认的跳转行为
    e.preventDefault();

    // 获取目标元素的 ID
    var targetId = this.getAttribute('href');

    // 如果 href 是锚点链接（以 # 开头）
    if (targetId && targetId.startsWith('#')) {
      // 查找目标元素
      var targetElement = document.getElementById(targetId.substring(1));

      if (targetElement) {
        // 计算目标位置（考虑固定头部的高度）
        var headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
        var targetPosition = targetElement.offsetTop + headerHeight;

        // 使用平滑滚动
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});
