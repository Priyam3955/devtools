import React from "react";
import hooks from "ui/hooks";
import { connect, ConnectedProps } from "react-redux";
import * as selectors from "ui/reducers/app";
import { UIState } from "ui/state";
import { RecordingId } from "@recordreplay/protocol";
import { WorkspaceId } from "ui/state/app";
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem } from "./LibraryDropdown";
import { getButtonClasses } from "../shared/Button";
import MaterialIcon from "../shared/MaterialIcon";
import classNames from "classnames";

type BatchActionDropdownProps = PropsFromRedux & {
  selectedIds: RecordingId[];
  setSelectedIds: any;
};

function BatchActionDropdown({
  selectedIds,
  setSelectedIds,
  currentWorkspaceId,
}: BatchActionDropdownProps) {
  const { workspaces, loading } = hooks.useGetNonPendingWorkspaces();
  const updateRecordingWorkspace = hooks.useUpdateRecordingWorkspace();
  const deleteRecording = hooks.useDeleteRecordingFromLibrary();

  if (loading) {
    return null;
  }

  const deleteSelectedIds = () => {
    const count = selectedIds.length;
    const message = `This action will permanently delete ${count == 1 ? "this" : count} replay${
      count == 1 ? "" : "s"
    }. \n\nAre you sure you want to proceed?`;

    if (window.confirm(message)) {
      selectedIds.forEach(recordingId => deleteRecording(recordingId, currentWorkspaceId));
      setSelectedIds([]);
    }
  };
  const updateRecordings = (targetWorkspaceId: WorkspaceId | null) => {
    selectedIds.forEach(recordingId =>
      updateRecordingWorkspace(recordingId, currentWorkspaceId, targetWorkspaceId)
    );
    setSelectedIds([]);
  };

  const button =
    selectedIds.length > 0 ? (
      <DropdownButton className={getButtonClasses("blue", "secondary", "md")}>
        <span className={classNames("space-x-1 flex flex-row items-center leading-4")}>
          <MaterialIcon outlined className="text-sm leading-4 font-bold" color="text-primaryAccent">
            expand_more
          </MaterialIcon>
          <span>{`${selectedIds.length} item${selectedIds.length > 1 ? "s" : ""} selected`}</span>
        </span>
      </DropdownButton>
    ) : (
      <DropdownButton
        className={classNames("cursor-default", getButtonClasses("blue", "disabled", "md"))}
        disabled
      >
        <span className={classNames("space-x-1 flex flex-row items-center leading-4")}>
          <MaterialIcon outlined className="text-sm leading-4 font-bold">
            expand_more
          </MaterialIcon>
          <span>{`${selectedIds.length} item${selectedIds.length > 1 ? "s" : ""} selected`}</span>
        </span>
      </DropdownButton>
    );

  return (
    <div className="relative">
      <Dropdown button={button} menuItemsClassName="z-50">
        <DropdownItem onClick={deleteSelectedIds}>{`Delete ${selectedIds.length} item${
          selectedIds.length > 1 ? "s" : ""
        }`}</DropdownItem>
        <div className="px-4 py-2 text-xs uppercase font-bold">Move to:</div>
        <DropdownDivider />
        <div className="overflow-y-auto max-h-48">
          {currentWorkspaceId ? (
            <DropdownItem onClick={() => updateRecordings(null)}>Your library</DropdownItem>
          ) : null}
          {workspaces
            .filter(w => w.id !== currentWorkspaceId)
            .map(({ id, name }) => (
              <DropdownItem onClick={() => updateRecordings(id)} key={id}>
                {name}
              </DropdownItem>
            ))}
        </div>
      </Dropdown>
    </div>
  );
}

const connector = connect((state: UIState) => ({
  currentWorkspaceId: selectors.getWorkspaceId(state),
}));
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(BatchActionDropdown);