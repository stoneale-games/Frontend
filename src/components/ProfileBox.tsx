import Tile from "./Tile";
import cp from "../assets/cp.png";
import star from "../assets/star.png";

const ProfileBox = ({ imgSrc, name, starIndex, cpIndex }: { imgSrc: string, name: string, starIndex: string, cpIndex: string }) => {
    return <article className="bg-primary-900 flex flex-col items-center gap-2 py-6">
        <img src={imgSrc} alt={name} className="rounded-2xl w-24 " />
        <h3 className="font-semibold text-sm text-white-950">{name}</h3>
        <div className="flex items-center gap-4">
            <Tile img={{ src: cp, alt: "cp" }} title={cpIndex} />
            <Tile img={{ src: star, alt: "star" }} title={starIndex} />
        </div>
    </article>
}

export default ProfileBox;