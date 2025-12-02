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
      <g transform="translate(0, -2)">
        <path
          d="M50,5 C25.1,5 5,25.1 5,50 C5,74.9 25.1,95 50,95 C74.9,95 95,74.9 95,50 C95,25.1 74.9,5 50,5 Z"
          fill="#006838"
        />
        <path
          d="M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C72.1,90 90,72.1 90,50 C90,27.9 72.1,10 50,10 Z"
          fill="#8CC63F"
        />
        <path
          d="M86,50 C86,30.1 69.9,14 50,14 C30.1,14 14,30.1 14,50 C14,69.9 30.1,86 50,86 C69.9,86 86,69.9 86,50 Z"
          fill="#006838"
        />

        <path
          fill="#FFFFFF"
          d="M 33.32,60.33 V 40.59 H 26.54 V 35.31 H 43.19 V 40.59 H 36.42 V 60.33 Z"
        />
        <path
          fill="#FFFFFF"
          d="M 52.88,48.16 C 55.44,48.16 57.23,49.1 57.23,51.84 V 60.33 H 54.14 V 52.12 C 54.14,51.04 53.6,50.62 52.6,50.62 C 51.5,50.62 50.8,51.2 50.8,52.4 V 60.33 H 47.7 V 43.71 H 50.8 V 46.12 C 51.5,44.64 52.6,43.43 54.4,43.43 C 56.6,43.43 58.1,44.7 58.1,47.2 V 48.05 C 57.8,47.9 57.4,47.8 57,47.8 C 55,47.8 53.7,48.8 52.88,48.16 Z"
        />
        <path
          fill="#FFFFFF"
          d="M 64,35.31 V 60.33 H 60.91 V 35.31 Z M 76.5,35.31 V 60.33 H 73.41 V 35.31 Z M 70.25,46.12 V 49.33 H 76.5 V 46.12 Z"
        />
        
        <path
          d="M 58,47.2 C 58.5,42.5 54,40 50,40 C 46,40 41.5,42.5 42,47.2"
          stroke="#8CC63F"
          strokeWidth="3.5"
          fill="none"
        />
      </g>
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
