import { TImg } from "../utils/types";

const BoxCard = ({ title, img, value }: { title: string; img: TImg; value: string }) => {
    return <div className="bg-primary-blue-300 flex-1 flex flex-col gap-6 justify-center items-center rounded-md h-36 shadow-xl">
        <h3 className="font-semibold text-secondary-600">{title}</h3>
        <div className="flex gap-2 items-center">
            <img src={img.src} alt={img.alt} />
            <div className="text-2xl text-secondary-300">{value}</div>
        </div>
    </div>
}

export default BoxCard