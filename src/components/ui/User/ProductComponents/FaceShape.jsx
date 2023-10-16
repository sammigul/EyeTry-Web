



import React from "react";
// import aviatrix from '../../../../assets/images/products/frameShapes/aviatrix.png'
// import browline from '../../../../assets/images/products/frameShapes/browline.png'
// import cateye from '../../../../assets/images/products/frameShapes/cateye.png'
// import oval from '../../../../assets/images/products/frameShapes/oval.png'
// import polygon from '../../../../assets/images/products/frameShapes/polygon.png'
// import rectangle from '../../../../assets/images/products/frameShapes/rectangle.png'
// import round from '../../../../assets/images/products/frameShapes/round.png'
// import square from '../../../../assets/images/products/frameShapes/square.png'

// const shapeImages = {
//     "All Shapes": null,
//     "Aviatrix": aviatrix,
//     "Cat Eye": cateye,
//     "Browline": browline,
//     "Oval": oval,
//     "Polygon": polygon,
//     "Rectangle": rectangle,
//     "Round": round,
//     "Square": square,
// };

import FaceDetection from "../../../../pages/User/FaceDetection/FaceDetection";

const shapeFilter = ({ selectedShape, onShapeSelect }) => {
    const sizeOptions = [
        "All Shapes",
        "Round Face",
        "Square Face",
        "Oval Face",
        "Heart-shaped Face",
        "Diamond Face",
        "Rectangle/Long Face"
    ];

    const handleShapeClick = (shape) => {
        // Update the selected shape when a shape is clicked
        onShapeSelect(shape);
        console.log("selected face shape in shapeFilter page: " + shape)
    };

    return (
        <>
            <div className="absolute left-0 p-2 bg-white rounded-md shadow-lg z-50 w-[300px] cursor-pointer">
                <ul className="space-y-2 cursor-pointer">
                    {sizeOptions.map((shape, index) => (
                        <li
                            key={index}
                            className={` rounded-sm py-1 px-1 transition duration-100 ease-in-out
                            ${selectedShape === shape ? 'bg-gray-700 hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            <div onClick={() => handleShapeClick(shape)} className="cursor-pointer flex items-center">
                                <input className="cursor-pointer w-5 h-4 mr-5"
                                    type="checkbox"
                                    id={shape}
                                    checked={selectedShape === shape}
                                    onChange={() => handleShapeClick(shape)}
                                />
                                {/* <img
                                    src={shapeImages[shape]}
                                    className="w-6 h-3 mr-2"
                                /> */}
                                <label
                                    htmlFor={shape}
                                    className={`font-sans cursor-pointer ${selectedShape === shape ? "text-white " : ""
                                        }`}
                                >
                                    {shape}
                                </label>
                            </div>
                        </li>
                    ))}
                    <div className="rounded-sm py-2 px-4 transition duration-100 ease-in-out text-blue-400 bg-gray-200 hover:bg-gray-100 flex justify-center">
                    <FaceDetection onFaceShapeChange={handleShapeClick} />
                    </div>
                </ul>
            </div>
        </>
    );
};

export default shapeFilter;
