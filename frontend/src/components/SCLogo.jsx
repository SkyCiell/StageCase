// SC Logo — Updated to StageCase Dark Jade & Gold design system
const SCLogo = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background circle — Dark Jade */}
    <circle cx="20" cy="20" r="20" fill="#2D6F73" />
    {/* Ticket notch dots — Gold */}
    <circle cx="2" cy="20" r="2.5" fill="#B89B5E" />
    <circle cx="38" cy="20" r="2.5" fill="#B89B5E" />
    {/* S letterform — Ivory */}
    <path
      d="M9 15.5C9 13 11 11 14 11H18C18 11 19 11 19 12C19 13 18 13 18 13H14C13 13 11 13 11 15.5C11 18 14 18 14 18H16C18 18 21 19 21 21.5C21 24 18.5 25 16 25H11C11 25 10 25 10 24C10 23 11 23 11 23H16C17.5 23 19 22 19 21.5C19 21 17.5 20 16 20H14C11 20 9 18 9 15.5Z"
      fill="#F3F4F6"
    />
    {/* C letterform — Gold */}
    <path
      d="M31 14C29.5 12.5 27.5 11 24.5 11C21 11 20 13.5 20 18C20 22.5 21 25 24.5 25C27.5 25 29.5 23.5 31 22"
      stroke="#B89B5E"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default SCLogo;
