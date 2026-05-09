export default function Banner({ bannerImageSrc = '', mirrorImage = false }) {
  const bannerImage = bannerImageSrc;

  return (
    <div className="relative w-full max-w-[22rem]">
      <div className="relative mx-auto w-[21.39rem]">
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
