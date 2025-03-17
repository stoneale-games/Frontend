const StarCard = ({
  size,
  title,
  subtitle,
  imgSrc,
  mainRotation,
  dummyRotation,
}: {
  size: "small" | "big";
  title: string;
  subtitle: string;
  imgSrc: string;
  mainRotation: string;
  dummyRotation: string;
}) => {
  return (
    <article
      className={`${mainRotation} bg-white-100 relative ${
        size === "small" ? "h-48" : "h-56"
      } aspect-square rounded-2xl ring-1 ring-secondary-950`}
    >
      <img src={imgSrc} alt={title} className="absolute -top-20 w-96" />
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center ">
        <h3 className="font-semibold text-lg">{title}</h3>
        <h3 className="font-semibold text-lg">{subtitle}</h3>
      </div>
      {/* A dummy div */}
      <div
        className={`${dummyRotation} absolute left-0 right-0 bottom-0 top-0 ring-1 ring-secondary-950 rotate-12 rounded-2xl`}
      ></div>
    </article>
  );
};

export default StarCard;
