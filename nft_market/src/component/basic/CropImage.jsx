import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../js/cropImage";
import ButtonPrimary from "./btn-primary";
import { GiCancel } from "react-icons/gi";

export default function CropImage({
  title,
  content,
  img,
  width,
  height,
  onClose,
  onSave,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // 좌표? 관련 변수
  const [rotation, setRotation] = useState(0); // 회전 관련 변수
  const [zoom, setZoom] = useState(1); // 확대, 축소 관련 변수
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // 크롭할 때 쓰이는 변수

  // 크롭이 끝났을 때 쓰이는 메서드
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // 이미지를 최종적으로 크롭하는 메서드
  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        img,
        croppedAreaPixels,
        rotation
      );
      console.log("donee", { croppedImage });
      onSave(croppedImage); // 콜백 메서드 호출
      onClose(); // 종료
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <GiCancel className="self-end" size={25} onClick={onClose} />
      <div className="self-start">
        <div className="text-2xl font-bold my-2">{title}</div>
        <div className="mb-5">{content}</div>
      </div>

      <div className="w-full grow relative mt-8 mb-5">
        <Cropper
          image={img}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={width / height}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <input
        type="range"
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        aria-labelledby="Zoom"
        onChange={(e) => {
          setZoom(e.target.value);
        }}
        className="zoom-range w-full my-5"
      />
      <div className="self-end">
        <ButtonPrimary text={"저장"} onClick={showCroppedImage} />
      </div>
    </div>
  );
}
