import { T as TreeView } from "./TreeView.js";
const treeData1 = {
  label: "백두산",
  type: "folder",
  expanded: true,
  children: [
    {
      label: "Landsat",
      type: "folder",
      expanded: true,
      children: [
        {
          label: "LC09_L1TP_116031_20231012...",
          type: "file",
          tag: "ZIP",
          size: "56.2MB",
          downloadable: true,
          deletable: true
        }
      ]
    }
  ]
};
const treeData2 = {
  label: "OUTPUT",
  type: "folder",
  expanded: true,
  children: [
    {
      label: "ALOS-2",
      type: "folder",
      expanded: false,
      children: []
    },
    {
      label: "Sentinel-2",
      type: "folder",
      expanded: true,
      children: [
        {
          label: "백두산",
          type: "folder",
          expanded: true,
          children: [
            {
              label: "20250125",
              type: "folder",
              expanded: true,
              selected: true,
              action: "분석 완료",
              children: [
                {
                  label: "Sentinel2_백두산_20250125.tif",
                  type: "file",
                  tag: "TIF",
                  size: "85.3MB",
                  downloadable: true,
                  deletable: true
                },
                {
                  label: "Sentinel2_백두산_20250125.xml",
                  type: "file",
                  tag: "XML",
                  size: "13.4MB",
                  downloadable: true,
                  deletable: true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
function handleDownload(node) {
  console.log("다운로드 요청:", node);
  alert(`다운로드 시작: ${node.label}`);
}
function handleDelete(node) {
  console.log("삭제 요청:", node);
  if (confirm(`"${node.label}"을(를) 정말 삭제하시겠습니까?`)) {
    alert(`삭제 완료: ${node.label}`);
  }
}
function handleNodeClick(node) {
  console.log("노드 클릭:", node);
}
document.addEventListener("DOMContentLoaded", function() {
  new TreeView(
    document.getElementById("tree-1"),
    treeData1,
    {
      onDownloadClick: handleDownload,
      onDeleteClick: handleDelete,
      onNodeClick: handleNodeClick
    }
  );
  new TreeView(
    document.getElementById("tree-2"),
    treeData2,
    {
      onDownloadClick: handleDownload,
      onDeleteClick: handleDelete,
      onNodeClick: handleNodeClick
    }
  );
});
