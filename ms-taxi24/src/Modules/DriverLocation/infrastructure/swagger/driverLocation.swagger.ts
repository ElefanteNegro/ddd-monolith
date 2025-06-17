/**
 * @swagger
 * components:
 *   schemas:
 *     DriverLocation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *           description: "ID único de la ubicación del conductor"
 *         driverId:
 *           type: string
 *           example: "d76acd86-014c-49ef-905d-2297612881a0"
 *           description: "ID del conductor"
 *         latitude:
 *           type: number
 *           example: 40.416775
 *           description: "Latitud de la ubicación del conductor"
 *         longitude:
 *           type: number
 *           example: -3.703790
 *           description: "Longitud de la ubicación del conductor"
 *         lastUpdate:
 *           type: string
 *           format: date-time
 *           example: "2024-03-20T12:00:00Z"
 *           description: "Fecha y hora de la última actualización"
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: "Indica si el conductor está activo en el sistema"
 *         isFree:
 *           type: boolean
 *           example: true
 *           description: "Indica si el conductor está disponible para viajes"
 *         driver:
 *           $ref: '#/components/schemas/Driver'
 *           description: "Información del conductor"
 */

/**
 * @swagger
 * /v1/driver-location/nearest:
 *   get:
 *     summary: Obtener los conductores más cercanos a una ubicación
 *     description: Retorna una lista de los conductores más cercanos a una ubicación específica, ordenados por distancia
 *     tags: [DriverLocation]
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: "Longitud de la ubicación (ej: -3.703790 para Madrid)"
 *         example: -3.703790
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: "Latitud de la ubicación (ej: 40.416775 para Madrid)"
 *         example: 40.416775
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *         description: "Número máximo de conductores a retornar (máximo 10)"
 *         example: 3
 *       - in: query
 *         name: onlyAvailable
 *         schema:
 *           type: boolean
 *           default: true
 *         description: "Si se deben retornar solo conductores disponibles"
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de conductores más cercanos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DriverLocation'
 *       400:
 *         description: Error en los parámetros de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Longitude and latitude are required"
 *       404:
 *         description: No se encontraron conductores en el área
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No drivers found in the area"
 */

/**
 * @swagger
 * /v1/driver-location/{driverId}/location:
 *   get:
 *     summary: Obtener la ubicación actual de un conductor
 *     tags: [DriverLocation]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID del conductor"
 *     responses:
 *       200:
 *         description: Ubicación del conductor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DriverLocation'
 *       404:
 *         description: Conductor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Driver location not found"
 */

/**
 * @swagger
 * /v1/driver-location/{driverId}/location:
 *   put:
 *     summary: Actualizar la ubicación y disponibilidad de un conductor
 *     tags: [DriverLocation]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID del conductor"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *               - isAvailable
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 40.416775
 *               longitude:
 *                 type: number
 *                 example: -3.703790
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Ubicación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DriverLocation'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       404:
 *         description: Conductor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Driver not found"
 */

/**
 * @swagger
 * /v1/driver-location/{driverId}/status:
 *   patch:
 *     summary: Actualizar el estado de un conductor
 *     tags: [DriverLocation]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del conductor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *               - isFree
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               isFree:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Driver status updated successfully"
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "isActive and isFree must be boolean values"
 */

/**
 * @swagger
 * /v1/driver-location/{driverId}:
 *   delete:
 *     summary: Eliminar un conductor del sistema de ubicaciones
 *     tags: [DriverLocation]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del conductor
 *     responses:
 *       200:
 *         description: Conductor eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Driver removed successfully"
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Driver ID is required"
 */
export default {
  components: {
    schemas: {
      DriverLocation: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          driverId: {
            type: 'string',
            example: 'd76acd86-014c-49ef-905d-2297612881a0'
          },
          latitude: {
            type: 'number',
            example: 40.416775
          },
          longitude: {
            type: 'number',
            example: -3.703790
          },
          lastUpdate: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T12:00:00Z'
          },
          isActive: {
            type: 'boolean',
            example: true
          },
          isFree: {
            type: 'boolean',
            example: true
          },
          driver: {
            $ref: '#/components/schemas/Driver'
          }
        }
      }
    }
  },
  paths: {
    '/v1/driver-location/nearest': {
      get: {
        summary: 'Obtener los conductores más cercanos a una ubicación',
        tags: ['DriverLocation'],
        parameters: [
          {
            in: 'query',
            name: 'longitude',
            required: true,
            schema: {
              type: 'number'
            },
            description: 'Longitud de la ubicación',
            example: -3.703790
          },
          {
            in: 'query',
            name: 'latitude',
            required: true,
            schema: {
              type: 'number'
            },
            description: 'Latitud de la ubicación',
            example: 40.416775
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              default: 3
            },
            description: 'Número máximo de conductores a retornar'
          },
          {
            in: 'query',
            name: 'onlyAvailable',
            schema: {
              type: 'boolean',
              default: true
            },
            description: 'Si se deben retornar solo conductores disponibles'
          }
        ],
        responses: {
          '200': {
            description: 'Lista de conductores más cercanos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/DriverLocation'
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Error en los parámetros de entrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    message: {
                      type: 'string',
                      example: 'Longitude and latitude are required'
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'No se encontraron conductores en el área',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    message: {
                      type: 'string',
                      example: 'No drivers found in the area'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/v1/driver-location/{driverId}/location': {
      get: {
        summary: 'Obtener la ubicación actual de un conductor',
        tags: ['DriverLocation'],
        parameters: [
          {
            in: 'path',
            name: 'driverId',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'ID del conductor'
          }
        ],
        responses: {
          '200': {
            description: 'Ubicación del conductor',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    data: {
                      $ref: '#/components/schemas/DriverLocation'
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Conductor no encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    message: {
                      type: 'string',
                      example: 'Driver location not found'
                    }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Actualizar la ubicación y disponibilidad de un conductor',
        tags: ['DriverLocation'],
        parameters: [
          {
            in: 'path',
            name: 'driverId',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'ID del conductor'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['latitude', 'longitude', 'isAvailable'],
                properties: {
                  latitude: {
                    type: 'number',
                    example: 40.416775
                  },
                  longitude: {
                    type: 'number',
                    example: -3.703790
                  },
                  isAvailable: {
                    type: 'boolean',
                    example: true
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Ubicación actualizada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Driver location updated successfully'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Error en los datos de entrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    message: {
                      type: 'string',
                      example: 'Latitude, longitude and isAvailable are required'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/v1/drivers/{driverId}/status': {
      patch: {
        summary: 'Actualizar el estado de un conductor',
        tags: ['DriverLocation'],
        parameters: [
          {
            in: 'path',
            name: 'driverId',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'ID del conductor'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['isActive', 'isFree'],
                properties: {
                  isActive: {
                    type: 'boolean',
                    example: true
                  },
                  isFree: {
                    type: 'boolean',
                    example: true
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Estado actualizado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Driver status updated successfully'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Error en los datos de entrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    message: {
                      type: 'string',
                      example: 'isActive and isFree must be boolean values'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/v1/drivers/{driverId}': {
      delete: {
        summary: 'Eliminar un conductor del sistema de ubicaciones',
        tags: ['DriverLocation'],
        parameters: [
          {
            in: 'path',
            name: 'driverId',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'ID del conductor'
          }
        ],
        responses: {
          '200': {
            description: 'Conductor eliminado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Driver removed successfully'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Error en la solicitud',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    message: {
                      type: 'string',
                      example: 'Driver ID is required'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}; 