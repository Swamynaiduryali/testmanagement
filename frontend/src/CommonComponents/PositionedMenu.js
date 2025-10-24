import * as React from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";

export const PositionedMenu = ({
  actions = [],
  icon = "ph:dots-three-vertical-bold",
  iconColor = "inherit",
  iconSize = 20,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action) => {
    action?.onClick?.();
    handleClose();
  };

  return (
    <div>
      <IconButton
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          borderRadius: "50%", // circular
          padding: "6px",
          "&:hover": {
            backgroundColor: "rgba(173, 216, 230, 0.4)", // light hover glow
          },
        }}
      >
        <Icon
          icon={icon}
          color={iconColor}
          width={iconSize}
          height={iconSize}
        />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {actions.map((action, index) => (
          <MenuItem key={index} onClick={() => handleActionClick(action)}>
            {action.icon && (
              <Icon icon={action.icon} style={{ marginRight: 8 }} />
            )}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
