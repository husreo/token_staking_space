function WalletConnectIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 32 32"
      className={className}
    >
      <path fill="#3396FF" d="M0 0H32V32H0z"></path>
      <path
        fill="#fff"
        d="M9.7 11.887c3.48-3.405 9.12-3.405 12.6 0l.418.41a.432.432 0 01.097.475.43.43 0 01-.097.141l-1.432 1.402a.226.226 0 01-.315 0l-.576-.564c-2.427-2.375-6.362-2.375-8.79 0l-.617.604a.226.226 0 01-.315 0l-1.432-1.402a.429.429 0 010-.616l.46-.45zm15.562 2.899l1.274 1.248a.428.428 0 010 .616l-5.747 5.626a.452.452 0 01-.63 0l-4.08-3.993a.113.113 0 00-.158 0l-4.079 3.993a.452.452 0 01-.63 0L5.464 16.65a.429.429 0 010-.616l1.275-1.248a.452.452 0 01.63 0l4.079 3.993a.113.113 0 00.157 0l4.08-3.993a.452.452 0 01.63 0l4.08 3.993a.113.113 0 00.157 0l4.08-3.993a.452.452 0 01.63 0z"
      ></path>
    </svg>
  );
}

export default WalletConnectIcon;