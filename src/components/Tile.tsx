import { TImg } from "../utils/types"

const Tile = ({ img, title }: { img: TImg, title: string }) => {
    return (
        <div className="flex items-center gap-2">
            <img src={img.src} alt={img.alt} className="h-4 w-4" />
            <div className="text-white-950 text-sm">{title}</div>
        </div>
    )
}

export default Tile