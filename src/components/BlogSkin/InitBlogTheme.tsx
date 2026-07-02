import Script from 'next/script'
import React from 'react'

export const InitBlogTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
(function(){
  var d=document.documentElement,k='theme',v=localStorage.getItem(k);
  if(v==='dark'||(!v&&window.matchMedia('(prefers-color-scheme:dark)').matches)){
    d.classList.add('dark');
    d.setAttribute('data-theme','dark');
  } else {
    d.classList.remove('dark');
    d.setAttribute('data-theme','light');
  }
  var h=localStorage.getItem('themeHue');
  if(h!==null){
    var n=parseInt(h,10);
    if(!isNaN(n)&&n>=0&&n<=360)d.style.setProperty('--hue',String(n));
  }
})();
`,
      }}
      id="blog-theme-script"
      strategy="beforeInteractive"
    />
  )
}
