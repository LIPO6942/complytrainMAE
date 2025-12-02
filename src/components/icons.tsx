import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

export function MaeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100"
      height="100"
      {...props}
    >
      <circle cx="50" cy="50" r="45" fill="#38761d" />
      <circle cx="50" cy="50" r="38" fill="white" />
      <path
        d="M25 65 L 35 35 L 45 65 L 40 65 L 37.5 57.5 L 32.5 57.5 L 30 65 Z"
        fill="#38761d"
      />
      <path
        d="M50 35 L 50 65 L 55 65 L 55 45 L 65 45 L 65 40 L 55 40 L 55 35 Z"
        fill="#38761d"
        transform="translate(5, 0)"
      />
      <path
        d="M70 35 L 70 65 L 75 65 L 75 35 Z M 70 47.5 L 75 47.5"
        fill="#38761d"
        transform="translate(5,0)"
      />
      <path d="M30 50 H 40" stroke="#a6d785" strokeWidth="4" />
      <path d="M50 52.5 H 65" stroke="#a6d785" strokeWidth="4" transform="translate(5, 0)" />
      <path d="M70 50 H 75" stroke="#a6d785" strokeWidth="4" transform="translate(5,0)" />
    </svg>
  );
}

export function BadgeAmlExpert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function BadgeKycCertified(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m16 12-4 4-2-2" />
      <path d="M12 8v4" />
    </svg>
  );
}

export function BadgeFraudDetector(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3.5 3.5 2 2" />
      <path d="M20.5 20.5 22 22" />
      <path d="m2 22 7.5-7.5" />
      <path d="m14.5 9.5 7.5 7.5" />
      <path d="M9 13.5 2 22" />
      <path d="M22 2 13.5 10.5" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function BadgeGdprPro(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 12v-4" />
            <path d="M12 18a6 6 0 0 0-6-6" />
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="m15 9.5-3-3-3 3" />
        </svg>

    )
}

export function BadgeSanctionsSpecialist(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}

export function BadgeInsuranceExpert(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m14.5 2.5-3 3-3-3-5 5 3 3-3 3 5 5 3-3 3 3 5-5-3-3 3-3z" />
            <path d="m2.5 14.5 5 5" />
            <path d="m16.5 7.5 5 5" />
        </svg>
    )
}
