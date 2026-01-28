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

func (h *APIHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "flarelink-relayer"})
}
