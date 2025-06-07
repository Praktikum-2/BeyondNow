import React from "react";

interface InitialsAvatarProps {
  name: string;
  size?: number; // velikost v px, privzeto 40
}

const getInitials = (name: string) => {
  const names = name.trim().split(" ");
  if (names.length === 0) return "";
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
};

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`;
  return color;
};

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ name, size = 40 }) => {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  return (
    <div
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: size / 2,
        userSelect: "none",
        textTransform: "uppercase",
      }}>
      {initials}
    </div>
  );
};

export default InitialsAvatar;
