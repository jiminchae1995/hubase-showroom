import type { Illustration } from "@/data/showroom";

/** Abstract line drawings for pending assets, never presented as product photographs. */
export function ProductArt({
  kind,
  className = "",
}: {
  kind: Illustration;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      className={`product-art ${className}`}
      aria-hidden="true"
    >
      <ellipse
        cx="184"
        cy="200"
        rx="115"
        ry="13"
        fill="currentColor"
        opacity=".045"
      />
      <g stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        {kind === "divider" && (
          <>
            <path
              d="M69 175 231 93 295 130 132 213Z"
              fill="white"
              fillOpacity=".65"
            />
            <path d="M112 182V94l143-72v88Z" fill="white" fillOpacity=".7" />
            <path d="m112 182 12 7 144-72-13-7M124 189V101l144-72-13-7M268 29v88" />
            <path d="m69 175 63 38 163-83M132 213v-8" opacity=".45" />
          </>
        )}
        {kind === "pusher" && (
          <>
            <path
              d="m50 163 181-91 82 45-179 94Z"
              fill="white"
              fillOpacity=".65"
            />
            <path d="m50 163 1 14 83 47 179-94v-13M134 211v13M73 166l164-82M98 180l165-83M124 194l164-83" />
            <path d="M207 124V53q0-10 9-6l51 28q8 4 8 13v72Z" fill="#e8e9e7" />
            <path
              d="m207 124 68 36M70 175v-36l66 37v35M84 175v-22l38 22v22"
              fill="white"
              fillOpacity=".75"
            />
            <path d="m152 169 56-28m-44 34 55-28" strokeDasharray="3 4" />
          </>
        )}
        {kind === "rail" && (
          <>
            <path
              d="m49 154 236-88 30 20-237 91Z"
              fill="white"
              fillOpacity=".6"
            />
            <path
              d="m49 154 7 43 238-88 21-23M78 177v30l237-91V86M56 197l22 10"
              fill="white"
              fillOpacity=".65"
            />
            <path
              d="m100 174 162-62v21l-162 62Z"
              fill="#f0eeeb"
              stroke="none"
            />
            <path d="m115 180 31-12m8-3 28-11m9-4 54-20" opacity=".35" />
            <path d="m267 115 23-9" stroke="var(--red)" strokeWidth="4" />
          </>
        )}
        {kind === "shelf" && (
          <>
            <path
              d="m52 152 185-84 75 35-185 88Z"
              fill="white"
              fillOpacity=".65"
            />
            <path
              d="M52 152v-37l75 36v40M127 151l185-88v40M52 115l185-85 75 33M237 30v38"
              fill="white"
              fillOpacity=".45"
            />
            <path d="M66 166v13l61 29 185-88v-17M127 191v17M81 100V74l27 12v84M275 47V25l23 11v72" />
          </>
        )}
        {(kind === "pop" || kind === "swing") && (
          <>
            <path
              d="m121 181 60-29 70 35-60 29Z"
              fill="white"
              fillOpacity=".5"
            />
            <path d="M180 168V54M188 173V58" strokeWidth="4" />
            <path
              d="m118 46 117 24v109l-117-26Z"
              fill="white"
              fillOpacity=".85"
            />
            <path d="m128 57 97 21v85l-97-22Z" strokeOpacity=".3" />
            <path
              d="m146 89 61 13m-61 5 45 10m-45 6 55 12"
              strokeOpacity=".4"
            />
            <path d="m150 138 43 9" stroke="var(--red)" strokeWidth="4" />
            {kind === "swing" && <path d="M173 56V29q0-13 14-10l19 5v22" />}
          </>
        )}
      </g>
    </svg>
  );
}
