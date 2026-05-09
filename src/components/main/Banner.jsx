export default function Banner({ bannerImageSrc = '', mirrorImage = false, bannerScale = 1 }) {
  const bannerImage = bannerImageSrc;

  return (
    <div className="relative w-full max-w-[22rem]">
      <div className="relative mx-auto w-[21.39rem]" style={{ transform: `scale(${bannerScale})` }}>
        <img
          src={bannerImage}
          alt=""
          aria-hidden="true"
          className={`h-auto w-full object-contain ${mirrorImage ? '-scale-x-100' : ''}`}
        />
      </div>
    </div>
  );
}
