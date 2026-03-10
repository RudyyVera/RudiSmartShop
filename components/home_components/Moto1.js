import Word from "./Word";

const words = ["ESSENTIALS", "FOR", "THE", "MODERN", "DEV"];

export default function Moto1() {

  return (
    <div className="relative px-4 py-10 text-primarycont bg-primarycont curier overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)", backgroundSize: "3px 3px" }}></div>
      <div className="relative z-10 text-6xl pt-32 -mb-10 sm:text-7xl flex justify-start flex-wrap gap-y-4 gap-x-7">
        {words.map((value, i) => (
          <Word key={i} txt={value} delay={i * 0.2} />
        ))}
      </div>

      <div className="relative z-10 scrolly text-[28vw] font-extrabold overflow-scroll scrollbar-hide">
        <p className="cont whitespace-nowrap">NIMAL</p>
      </div>
      <style jsx>{`
        .cont {
          text-transform: uppercase;
          display: inline-block;
          animation: floatText 13s infinite linear;
          padding-left: 100%; /*Initial offset, which places the text off-screen*/
        }
        @keyframes floatText {
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
