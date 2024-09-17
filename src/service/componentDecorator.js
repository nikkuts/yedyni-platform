export const componentDecorator = (href, text, key) => (
    <a 
        href={href} 
        key={key} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ 
            textDecoration: 'underline',
            color: '#3754fd' 
        }}
    >
      {text}
    </a>
  );