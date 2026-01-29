package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"flarelink-relayer/internal/state"
)

type APIHandler struct {
	stateStore *state.StateStore
}

func NewAPIHandler(store *state.StateStore) *APIHandler {
	return &APIHandler{
		stateStore: store,
	}
}

func (h *APIHandler) RegisterRoutes(router *gin.Engine) {
	api := router.Group("/api/v1")
	{
		api.GET("/bridge/status/:id", h.GetBridgeStatus)
		api.GET("/bridge/user/:address", h.GetUserHistory)
		api.POST("/bridge/track", h.TrackBridge)
		api.GET("/health", h.HealthCheck)
	}
}

func (h *APIHandler) GetBridgeStatus(c *gin.Context) {
	id := c.Param("id")
	record, err := h.stateStore.GetBridgeRecord(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bridge transaction not found", "data": nil})
		return
	}
	if record == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bridge transaction not found", "data": nil})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": record})
}

func (h *APIHandler) GetUserHistory(c *gin.Context) {
	address := c.Param("address")
	records, err := h.stateStore.ListUserBridges(address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user history"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": records})
}

func (h *APIHandler) TrackBridge(c *gin.Context) {
	var record state.BridgeRecord
	if err := c.ShouldBindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Basic validation
	if record.TransactionHash == "" || record.User == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing txHash or user"})
		return
	}

	// Always ensure pending status if tracked via API
	if record.Status == "" {
		record.Status = "pending"
		record.StatusAlias = "pending"
	}
	
	// Create a temporary ID if not present (will be updated by listener)
	if record.ID == "" {
		record.ID = "track-" + record.TransactionHash[:8]
	}

	if err := h.stateStore.SaveBridgeRecord(&record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction tracked successfully", "data": record})
}

func (h *APIHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "flarelink-relayer"})
}
