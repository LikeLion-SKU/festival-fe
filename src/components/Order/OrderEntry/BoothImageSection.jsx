function BoothImageSection({ Image }) {
  return (
    <div className="relative h-75 w-full">
      <div className="absolute bottom-0 w-full overflow-hidden">
        <Image className="w-full blur translate-y-4 -translate-x-0.7" />
      </div>
      <Image className="w-49 h-49 absolute top-37 left-7 z-10 rounded-lg" />
    </div>
  );
}

export default BoothImageSection;
