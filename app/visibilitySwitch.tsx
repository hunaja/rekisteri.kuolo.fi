"use client";

import { UserInterface } from "@/models/User";
import { Switch } from "@nextui-org/switch";
import React, { useState } from "react";

export default function VisibilitySwitch({
  initialState,
  user,
}: {
  initialState: boolean;
  user: UserInterface;
}) {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleVisibilityChange = async () => {
    setLoading(true);

    const response = await fetch(`/api/users/${user.email}`, {
      method: "PATCH",
      body: JSON.stringify({ visible: !state }),
    });
    const jsonResponse = await response.json();

    setState(jsonResponse.visible);
    setLoading(false);
  };

  return (
    <Switch
      className="mb-5"
      isDisabled={loading}
      isSelected={state}
      onValueChange={handleVisibilityChange}
    >
      Näy jäsenluettelossa
    </Switch>
  );
}
