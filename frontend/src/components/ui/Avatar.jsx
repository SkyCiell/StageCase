import { getImageUrl } from '../../services/api';

const Avatar = ({ src, name = '', size = 'md', type = 'avatars' }) => {
  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const imageUrl = src ? getImageUrl(src, type) : null;

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center bg-jade/20 border border-jade/30 flex-shrink-0`}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-jade">{initials || '?'}</span>
      )}
    </div>
  );
};

export default Avatar;
